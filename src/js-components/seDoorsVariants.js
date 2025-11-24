import { useEffect, useState } from "react";
import { supabase } from "../components/supabase/supabaseClient";

export function useDoorsVariants() {
  const [variants, setVariants] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadVariants = async () => {
      try {
        const { data, error } = await supabase
          .from("doors_variants")
          .select("*");

        if (error) throw error;

        if (isMounted) {
          console.log("doors_variants full data:", data);
          console.log("First variant object:", data?.[0]);
          setVariants(data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Error fetching variants:", err);
          setError(err.message || "Failed to fetch variants");
          setVariants(null);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadVariants();

    return () => {
      isMounted = false;
    };
  }, []);

  return { variants, error, loading };
}
