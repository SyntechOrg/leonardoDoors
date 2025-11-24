import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; 

if (!supabaseServiceKey) {
  console.error("❌ CRITICAL: SUPABASE_SERVICE_ROLE_KEY is missing.");
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

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

export async function getDoorsAndTaxonomies() {
  console.log("⚡️ ISR (Admin): Starting data fetch...");

  try {
    const [
      doorsResult,
      variantsResult,
      taxonomiesResult,
      taxonomyTypesResult,
    ] = await Promise.all([
      supabaseAdmin
        .from("doors")
        .select("*")
        .eq("is_deleted", false)
        .eq("current_status", "active"),
      supabaseAdmin.from("doors_variants").select("*"),
      supabaseAdmin.from("taxonomies").select("*"),
      supabaseAdmin.from("taxonomy_types").select("*"),
    ]);

    if (doorsResult.error) throw doorsResult.error;

    const doorsData = doorsResult.data || [];
    const variantsData = variantsResult.data || [];

    console.log(`✅ ISR Admin fetched: ${doorsData.length} doors`);

    const transformedDoors = doorsData.map((door) => {
      const doorVariants = variantsData.filter((v) => v.door_id === door.id);
      
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
        variants: doorVariants,
        stock: doorVariants.reduce((sum, v) => sum + (v.stock || 0), 0),
      };
    });

    return {
      doors: transformedDoors,
      variants: variantsData,
      taxonomies: taxonomiesResult.data || [],
      taxonomyTypes: taxonomyTypesResult.data || [],
    };

  } catch (error) {
    console.error("❌ ISR Fetch Error:", error);
    return { doors: [], variants: [], taxonomies: [], taxonomyTypes: [] };
  }
}

export async function getAllDoorIds() {
    const { data, error } = await supabaseAdmin
      .from("doors")
      .select("id")
      .eq("is_deleted", false)
      .eq("current_status", "active");
  
    if (error) {
      console.error("Error fetching door IDs:", error);
      return [];
    }
    return data;
  }
  
  export async function getDoorById(id) {
    try {
      const { data: door, error: doorError } = await supabaseAdmin
        .from("doors")
        .select("*")
        .eq("id", id)
        .single();
  
      if (doorError || !door) return null;
  
      const { data: variants, error: varError } = await supabaseAdmin
        .from("doors_variants")
        .select("*")
        .eq("door_id", id);
  
      if (varError) return null;
  
      const prices = variants
        .map((v) => v.discount_price || v.price)
        .filter((p) => p > 0);
      
      const transformedDoor = {
        ...transformDoor(door), 
        price: prices.length ? Math.min(...prices) : 0,
        minPrice: prices.length ? Math.min(...prices) : 0,
        maxPrice: prices.length ? Math.max(...prices) : 0,
        variants: variants,
        stock: variants.reduce((sum, v) => sum + (v.stock || 0), 0),
      };
  
      return transformedDoor;
    } catch (error) {
      console.error("Error fetching single door:", error);
      return null;
    }
  }