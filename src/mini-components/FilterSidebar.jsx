import React, { useState, useMemo, useCallback, useEffect } from "react";

const SearchInput = React.memo(({ value, onChange }) => {
  const [localValue, setLocalValue] = useState(value || "");

  useEffect(() => {
    setLocalValue(value || "");
  }, [value]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (localValue !== (value || "")) {
        onChange(localValue);
      }
    }, 800);

    return () => clearTimeout(handler);
  }, [localValue, onChange, value]);

  return (
    <section className="border-b pb-4 mb-2">
      <label className="text-xs font-medium text-gray-700 block mb-1">
        Suche
      </label>
      <div className="relative">
        <input
          type="text"
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          className="w-full px-2 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-600"
          placeholder="Suchen..."
        />
        {localValue && (
          <button
            onClick={() => {
              setLocalValue("");
              onChange("");
            }}
            className="absolute right-2 top-2.5 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        )}
      </div>
    </section>
  );
});

function FilterSection({ label, open, toggle, children }) {
  return (
    <section className="border-b last:border-b-0">
      <button
        type="button"
        onClick={toggle}
        className="flex w-full items-center justify-between py-3 hover:text-yellow-600 transition-colors"
      >
        <span className="font-semibold">{label}</span>
        <span className="select-none text-xl leading-none">
          {open ? "−" : "+"}
        </span>
      </button>
      {open && <div className="pb-4 space-y-2">{children}</div>}
    </section>
  );
}

function RangeInputs({ label, value, onChange, min, max, unit = "" }) {
  const [minInput, setMinInput] = useState(String(value?.[0] ?? min));
  const [maxInput, setMaxInput] = useState(String(value?.[1] ?? max));

  React.useEffect(() => {
    setMinInput(String(value?.[0] ?? min));
    setMaxInput(String(value?.[1] ?? max));
  }, [value, min, max]);

  const handleApply = useCallback(() => {
    const newMin = parseFloat(minInput) || min;
    const newMax = parseFloat(maxInput) || max;

    const validMin = Math.max(min, Math.min(newMin, max));
    const validMax = Math.min(max, Math.max(newMax, min));

    if (validMin <= validMax) {
      onChange(`${validMin}-${validMax}`);
    }
  }, [minInput, maxInput, min, max, onChange]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleApply();
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="flex-1">
          <label className="text-xs font-medium text-gray-700 block mb-1">
            Min {unit}
          </label>
          <input
            type="number"
            min={min}
            max={max}
            value={minInput}
            onChange={(e) => setMinInput(e.target.value)}
            onBlur={handleApply}
            onKeyPress={handleKeyPress}
            className="w-full px-2 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-600"
            placeholder={String(min)}
          />
        </div>
        <div className="flex-1">
          <label className="text-xs font-medium text-gray-700 block mb-1">
            Max {unit}
          </label>
          <input
            type="number"
            min={min}
            max={max}
            value={maxInput}
            onChange={(e) => setMaxInput(e.target.value)}
            onBlur={handleApply}
            onKeyPress={handleKeyPress}
            className="w-full px-2 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-600"
            placeholder={String(max)}
          />
        </div>
      </div>
    </div>
  );
}

export default function FilterSidebar({
  allDoors,
  filters,
  onFilterChange,
  taxonomies,
  taxonomyTypes,
}) {

  const [openSections, setOpenSections] = useState({
    category: true,
    brand: true,
    material: true,
    color: true,
    glazing: true,
    price: true,
    height: true,
    width: true,
    style: true,
  });

  const toggleSection = useCallback((key) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const filterData = useMemo(() => {
    const getTaxonomyOptions = (typeName) => {
      if (!taxonomies || !taxonomyTypes) return [];

      const taxType = taxonomyTypes.find((t) => t.name === typeName);
      if (!taxType) {
        console.warn(`Taxonomy type "${typeName}" not found.`);
        return [];
      }

      return taxonomies
        .filter((tax) => tax.type_id === taxType.id)
        .map((tax) => tax.name)
        .sort();
    };

    const counts = {
      category: {},
      material: {},
      color: {},
      glazing: {},
      style: {},
      brand: {},
    };
    const ranges = {
      heights: [],
      widths: [],
      prices: [],
    };

    if (allDoors?.length) {
      allDoors.forEach((door) => {
        if (door.category)
          counts.category[door.category] =
            (counts.category[door.category] || 0) + 1;
        if (door.material)
          counts.material[door.material] =
            (counts.material[door.material] || 0) + 1;
        if (door.color)
          counts.color[door.color] = (counts.color[door.color] || 0) + 1;
        if (door.glazing)
          counts.glazing[door.glazing] =
            (counts.glazing[door.glazing] || 0) + 1;
        if (door.style)
          counts.style[door.style] = (counts.style[door.style] || 0) + 1;
        if (door.brand)
          counts.brand[door.brand] = (counts.brand[door.brand] || 0) + 1;

        door.variants?.forEach((variant) => {
          if (variant.material)
            counts.material[variant.material] =
              (counts.material[variant.material] || 0) + 1;
          if (variant.door_style)
            counts.style[variant.door_style] =
              (counts.style[variant.door_style] || 0) + 1;

          if (variant.height && variant.height > 0)
            ranges.heights.push(variant.height);
          if (variant.width && variant.width > 0)
            ranges.widths.push(variant.width);
          if (variant.price && variant.price > 0)
            ranges.prices.push(variant.price);
          if (variant.discount_price && variant.discount_price > 0)
            ranges.prices.push(variant.discount_price);
        });
      });
    }

    const getRange = (arr, fallback) => {
      if (arr.length === 0) return fallback;
      const min = Math.min(...arr);
      const max = Math.max(...arr);
      return [min, max];
    };

    const materialOptions = getTaxonomyOptions("door_material");

    return {
      categories: getTaxonomyOptions("door_type"),
      materials: [...new Set(materialOptions)].sort(),
      colors: getTaxonomyOptions("door_color"),
      glazings: getTaxonomyOptions("door_glass"),
      styles: getTaxonomyOptions("door_style"),
      brands: getTaxonomyOptions("door_brand"),

      heightRange: getRange(ranges.heights, [800, 2200]),
      widthRange: getRange(ranges.widths, [360, 1200]),
      priceRange: getRange(ranges.prices, [0, 10000]),
      counts,
    };
  }, [allDoors, taxonomies, taxonomyTypes]);

  const renderCheckboxGroup = useCallback(
    (items, countKey, filterKey) => {
      if (!items?.length) {
        return <p className="text-sm text-gray-500">Keine Optionen</p>;
      }

      const counts = filterData.counts[countKey] || {};
      const selected = filters[filterKey] || [];

      return items.map((item) => (
        <label
          key={item}
          className="flex items-center gap-2 cursor-pointer text-sm hover:text-yellow-600"
        >
          <input
            type="checkbox"
            checked={selected.includes(item)}
            onChange={() => {
              const newValue = selected.includes(item)
                ? selected.filter((x) => x !== item)
                : [...selected, item];
              onFilterChange({ [filterKey]: newValue });
            }}
            className="accent-yellow-600"
          />
          <span className="flex-1">{item}</span>
          <span className="text-[11px] text-gray-400">
            ({counts[item] || 0})
          </span>
        </label>
      ));
    },
    [filterData, filters, onFilterChange]
  );

  return (
    <aside className="w-full shrink-0 space-y-1 pt-2 pb-6 md:w-72">
      <SearchInput
        value={filters.search}
        onChange={(val) => onFilterChange({ search: val })}
      />

      <FilterSection
        label="Türen"
        open={openSections.category}
        toggle={() => toggleSection("category")}
      >
        {renderCheckboxGroup(filterData.categories, "category", "category")}
      </FilterSection>

      <FilterSection
        label="Marke"
        open={openSections.brand}
        toggle={() => toggleSection("brand")}
      >
        {renderCheckboxGroup(filterData.brands, "brand", "brand")}
      </FilterSection>

      <FilterSection
        label="Materialien"
        open={openSections.material}
        toggle={() => toggleSection("material")}
      >
        {renderCheckboxGroup(filterData.materials, "material", "material")}
      </FilterSection>

      <FilterSection
        label="Farbe"
        open={openSections.color}
        toggle={() => toggleSection("color")}
      >
        {renderCheckboxGroup(filterData.colors, "color", "color")}
      </FilterSection>

      <FilterSection
        label="Verglasung"
        open={openSections.glazing}
        toggle={() => toggleSection("glazing")}
      >
        {renderCheckboxGroup(filterData.glazings, "glazing", "glazing")}
      </FilterSection>

      <FilterSection
        label="PREIS (CHF)"
        open={openSections.price}
        toggle={() => toggleSection("price")}
      >
        <RangeInputs
          label="Price Range"
          value={filters.price}
          onChange={(value) => onFilterChange({ price: value })}
          min={filterData.priceRange[0]}
          max={filterData.priceRange[1]}
          unit="CHF"
        />
      </FilterSection>

      <FilterSection
        label="Türhöhe (mm)"
        open={openSections.height}
        toggle={() => toggleSection("height")}
      >
        <RangeInputs
          label="Height Range"
          value={filters.height}
          onChange={(value) => onFilterChange({ height: value })}
          min={filterData.heightRange[0]}
          max={filterData.heightRange[1]}
          unit="mm"
        />
      </FilterSection>

      <FilterSection
        label="Türbreite (mm)"
        open={openSections.width}
        toggle={() => toggleSection("width")}
      >
        <RangeInputs
          label="Width Range"
          value={filters.width}
          onChange={(value) => onFilterChange({ width: value })}
          min={filterData.widthRange[0]}
          max={filterData.widthRange[1]}
          unit="mm"
        />
      </FilterSection>

      <FilterSection
        label="Türstil"
        open={openSections.style}
        toggle={() => toggleSection("style")}
      >
        {renderCheckboxGroup(filterData.styles, "style", "style")}
      </FilterSection>

      <button
        type="button"
        onClick={() =>
          onFilterChange({
            search: "", 
            category: [],
            material: [],
            color: [],
            glazing: [],
            style: [],
            brand: [],
            price: null,
            height: null,
            width: null,
          })
        }
        className="w-full mt-4 bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded transition-colors"
      >
        Filter zurücksetzen
      </button>
    </aside>
  );
}