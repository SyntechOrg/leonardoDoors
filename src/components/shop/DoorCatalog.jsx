"use client";

import React, { useMemo, useCallback, useEffect, useRef } from "react";
import FilterSidebar from "../../mini-components/FilterSidebar";
import Pagination from "../../mini-components/Pagination";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

const ITEMS_PER_PAGE = 9;

const parseArray = (value) => (value ? value.split(",").filter(Boolean) : []);

const parseRange = (value) => {
  if (!value) return null;
  const parts = value.split("-").map((p) => {
    const num = parseFloat(p);
    return isNaN(num) ? null : num;
  });
  return parts.length === 2 && parts[0] !== null && parts[1] !== null
    ? parts
    : null;
};

function useFilterState(searchParams) {
  return useMemo(
    () => ({
      category: parseArray(searchParams.get("category")),
      material: parseArray(searchParams.get("material")),
      color: parseArray(searchParams.get("color")),
      glazing: parseArray(searchParams.get("glazing")),
      style: parseArray(searchParams.get("style")),
      brand: parseArray(searchParams.get("brand")),
      search: searchParams.get("search") || "",
      price: parseRange(searchParams.get("price")),
      height: parseRange(searchParams.get("height")),
      width: parseRange(searchParams.get("width")),
      page: Math.max(1, parseInt(searchParams.get("page"), 10) || 1),
    }),
    [searchParams]
  );
}

// --- CHANGED: Accepts data via props instead of fetching it ---
export default function DoorCatalogClient({ 
  initialDoors, 
  initialTaxonomies, 
  initialTaxonomyTypes 
}) {
  // Default to empty arrays to prevent crashes if ISR returns null
  const doors = initialDoors || [];
  const taxonomies = initialTaxonomies || [];
  const taxonomyTypes = initialTaxonomyTypes || [];

  const router = useRouter();
  const searchParams = useSearchParams();
  const resultsHeaderRef = useRef(null);
  const prevPageRef = useRef(1);

  const filters = useFilterState(searchParams);

  const updateFilters = useCallback(
    (updates) => {
      const newParams = new URLSearchParams(searchParams.toString());
      const isPagination = "page" in updates;

      Object.entries(updates).forEach(([key, value]) => {
        if (!value || (Array.isArray(value) && !value.length)) {
          newParams.delete(key);
        } else if (Array.isArray(value)) {
          newParams.set(key, value.join(","));
        } else if (value !== null && value !== undefined) {
          newParams.set(key, String(value));
        } else {
          newParams.delete(key);
        }
      });

      if (!isPagination) {
        newParams.set("page", "1");
      }

      router.push(`/shop?${newParams.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  // Scroll to top of results when page changes
  useEffect(() => {
    if (filters.page !== prevPageRef.current) {
      if (filters.page > 1 || prevPageRef.current > 1) {
        resultsHeaderRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      prevPageRef.current = filters.page;
    }
  }, [filters.page]);

  // Filter logic remains exactly the same
  const filteredDoors = useMemo(() => {
    if (!doors?.length) return [];

    return doors.filter((door) => {
      // Door-level categorical filters
      if (
        filters.category.length &&
        !filters.category.includes(door.category)
      ) {
        return false;
      }

      if (filters.color.length && !filters.color.includes(door.color)) {
        return false;
      }

      if (
        filters.glazing.length &&
        !filters.glazing.includes(door.glazing)
      ) {
        return false;
      }

      if (filters.style.length && !filters.style.includes(door.style)) {
        return false;
      }

      if (filters.brand.length && !filters.brand.includes(door.brand)) {
        return false;
      }

      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
          door.name?.toLowerCase().includes(searchLower) ||
          door.brand?.toLowerCase().includes(searchLower) ||
          door.category?.toLowerCase().includes(searchLower);
        
        if (!matchesSearch) return false;
      }

      // Material filter: check door AND variant-level material
      if (filters.material.length) {
        const doorMaterial = door.material;
        const hasMaterial =
          (doorMaterial && filters.material.includes(doorMaterial)) ||
          door.variants?.some((v) =>
            filters.material.includes(v.material || "")
          );
        if (!hasMaterial) return false;
      }

      // Variant-based range filters
      const doorVariants = door.variants || [];

      // Price filter
      if (filters.price && filters.price.length === 2) {
        const [minPrice, maxPrice] = filters.price;
        const hasPriceMatch = doorVariants.some((v) => {
          const variantPrice = v.discount_price || v.price;
          return variantPrice >= minPrice && variantPrice <= maxPrice;
        });
        if (!hasPriceMatch) return false;
      }

      // Height filter
      if (filters.height && filters.height.length === 2) {
        const [minHeight, maxHeight] = filters.height;
        const hasHeightMatch = doorVariants.some((v) => {
          const variantHeight = v.height;
          return (
            variantHeight &&
            variantHeight >= minHeight &&
            variantHeight <= maxHeight
          );
        });
        if (!hasHeightMatch) return false;
      }

      // Width filter
      if (filters.width && filters.width.length === 2) {
        const [minWidth, maxWidth] = filters.width;
        const hasWidthMatch = doorVariants.some((v) => {
          const variantWidth = v.width;
          return (
            variantWidth &&
            variantWidth >= minWidth &&
            variantWidth <= maxWidth
          );
        });
        if (!hasWidthMatch) return false;
      }

      return true;
    });
  }, [doors, filters]);

  const paginatedDoors = useMemo(() => {
    const start = (filters.page - 1) * ITEMS_PER_PAGE;
    return filteredDoors.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredDoors, filters.page]);

  useEffect(() => {
    if (filters.page > 1 && filteredDoors.length > 0) {
      const maxPage = Math.ceil(filteredDoors.length / ITEMS_PER_PAGE);
      if (filters.page > maxPage) {
        updateFilters({ page: 1 });
      }
    }
  }, [filteredDoors.length, filters.page, updateFilters]);

  
  if (!doors || doors.length === 0) {
    return (
      <div className="text-gray-500 text-center py-20">
        <p>Keine Türen verfügbar.</p>
      </div>
    );
  }

  return (
    <section className="flex flex-col md:flex-row md:py-15 py-8 container mx-auto">
      <div className="sm:hidden flex justify-end p-4">
        <details className="w-full">
          <summary className="cursor-pointer bg-gray-100 px-3 py-2 rounded-md text-sm font-medium">
            Filter
          </summary>
          <FilterSidebar
            allDoors={doors}
            filters={filters}
            onFilterChange={updateFilters}
            taxonomies={taxonomies}
            taxonomyTypes={taxonomyTypes}
          />
        </details>
      </div>

      <div className="hidden sm:block">
        <FilterSidebar
          allDoors={doors}
          filters={filters}
          onFilterChange={updateFilters}
          taxonomies={taxonomies}
          taxonomyTypes={taxonomyTypes}
        />
      </div>

      <div className="flex-1 pl-4 sm:pl-8">
        <div ref={resultsHeaderRef} className="scroll-mt-24">
          <h2 className="font-bold text-xl mb-6">
            {filteredDoors.length} Ergebnis{filteredDoors.length !== 1 && "se"}{" "}
            für <span className="text-yellow-600">Türen</span>
          </h2>
        </div>

        {filteredDoors.length === 0 ? (
          <p className="text-gray-500">
            Keine Türen passen zu den gewählten Filtern.
          </p>
        ) : (
          <>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedDoors.map((door) => (
                <DoorCard key={door.id} door={door} />
              ))}
            </ul>
            <Pagination
              currentPage={filters.page}
              totalItems={filteredDoors.length}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={(page) => updateFilters({ page })}
            />
          </>
        )}
      </div>
    </section>
  );
}

const DoorCard = React.memo(({ door }) => (
  <Link
    href={`/checkout/${door.id}`}
    className="rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-white flex flex-col items-center"
  >
    <div className="bg-[#EBEBE9] w-full flex justify-center items-center 2xl:p-10 sm:p-8 p-10 rounded-lg 2xl:min-h-[550px] xl:min-h-[500px] lg:min-h-[400px] md:min-h-[300px]">
      <img
        src={door.images?.[0] || "/images/placeholder.png"}
        alt={door.name}
        className="object-contain w-fit h-auto max-h-100"
        loading="lazy"
      />
    </div>
    <div className="p-4 flex flex-col items-center">
      <h3 className="font-medium line-clamp-2">{door.name}</h3>
      {door.price > 0 && (
        <p className="mt-2 font-bold">
          CHF {door.price.toFixed(2)}
          {door.stock > 0 && (
            <span className="text-sm text-gray-500 ml-2">
              ({door.stock} in stock)
            </span>
          )}
        </p>
      )}
    </div>
  </Link>
));

DoorCard.displayName = "DoorCard";