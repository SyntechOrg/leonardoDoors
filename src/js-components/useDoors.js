import { useEffect, useState } from "react";
import { supabase } from "../components/supabase/supabaseClient";

const transformDoor = (door) => ({
  ...door,
  name: door.door_name,
  category: door.door_type,
  glazing: door.glass_insert,
  images: door.doorImages,
  rating: door.rating || 5,
  material: door.material || door.frame_material || null,
  color: door.color || null,
  style: door.door_style || null,
  brand: door.brand || null,
});

export function useDoors() {
  const [doors, setDoors] = useState(null);
  const [variants, setVariants] = useState(null);
  // --- ADDED STATES ---
  const [taxonomies, setTaxonomies] = useState(null);
  const [taxonomyTypes, setTaxonomyTypes] = useState(null);
  // --------------------
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadDoorsWithVariants = async () => {
      try {
        // --- MODIFIED: Fetch all data concurrently ---
        const [
          doorsResult,
          variantsResult,
          taxonomiesResult,
          taxonomyTypesResult,
        ] = await Promise.all([
          supabase
            .from("doors")
            .select("*")
            .eq("is_deleted", false)
            .eq("current_status", "active"),
          supabase.from("doors_variants").select("*"),
          supabase.from("taxonomies").select("*").eq("is_active", true),
          supabase.from("taxonomy_types").select("*"),
        ]);

        const { data: doorsData, error: doorsError } = doorsResult;
        if (doorsError) throw doorsError;

        const { data: variantsData, error: variantsError } = variantsResult;
        if (variantsError) throw variantsError;

        const { data: taxonomiesData, error: taxonomiesError } =
          taxonomiesResult;
        if (taxonomiesError) throw taxonomiesError;

        const { data: taxonomyTypesData, error: taxonomyTypesError } =
          taxonomyTypesResult;
        if (taxonomyTypesError) throw taxonomyTypesError;
        // ------------------------------------------

        console.log("Fetched doors:", doorsData);

        if (isMounted) {
          // Transform doors
          const transformedDoors = doorsData.map((door) => {
            // Get all variants for this door
            const doorVariants = variantsData.filter(
              (v) => v.door_id === door.id
            );

            // Get lowest price and size ranges
            const prices = doorVariants
              .map((v) => v.discount_price || v.price)
              .filter((p) => p > 0);
            const heights = doorVariants.map((v) => v.height).filter(Boolean);
            const widths = doorVariants.map((v) => v.width).filter(Boolean);

            return {
              ...transformDoor(door),
              price: prices.length ? Math.min(...prices) : 0,
              minPrice: prices.length ? Math.min(...prices) : 0,
              maxPrice: prices.length ? Math.max(...prices) : 0,
              minHeight: heights.length ? Math.min(...heights) : null,
              maxHeight: heights.length ? Math.max(...heights) : null,
              minWidth: widths.length ? Math.min(...widths) : null,
              maxWidth: widths.length ? Math.max(...widths) : null,
              variants: doorVariants,
              stock: doorVariants.reduce((sum, v) => sum + (v.stock || 0), 0),
            };
          });

          setDoors(transformedDoors);
          setVariants(variantsData);
          // --- ADDED: Set new states ---
          setTaxonomies(taxonomiesData);
          setTaxonomyTypes(taxonomyTypesData);
          // -----------------------------
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Error fetching data:", err);
          setError(err.message || "Failed to fetch data");
          setDoors(null);
          setVariants(null);
          // --- ADDED: Reset new states on error ---
          setTaxonomies(null);
          setTaxonomyTypes(null);
          // ----------------------------------------
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadDoorsWithVariants();

    return () => {
      isMounted = false;
    };
  }, []);

  // --- MODIFIED: Return new data ---
  return { doors, variants, taxonomies, taxonomyTypes, error, loading };
  // ---------------------------------
}
