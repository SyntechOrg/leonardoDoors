import React, { useEffect, useMemo, useRef, useState } from "react";

const DEFAULT_NAV = [
  { key: "details", label: "Details" },
  { key: "questions", label: "Produktfragen" },
  { key: "reviews", label: "Bewertungen" },
  // { key: "shipping", label: "Lieferinformationen" },
  // { key: "returns", label: "Rückgaberecht" },
];

export default function ProductInfo({
  heading = "Produktinformationen",
  nav = DEFAULT_NAV,
  details,
  questions,
  reviews,
  shipping,
  returns: returnsContent,
  defaultPanel = "details",
  className = "",
}) {
  const [active, setActive] = useState(defaultPanel);
  const keys = useMemo(() => nav.map((n) => n.key), [nav]);
  const tablistRef = useRef(null);
  const idPrefix = "pi-" + Math.random().toString(36).slice(2, 8);

  useEffect(() => {
    if (!keys.includes(active)) setActive(keys[0] || "details");
  }, [keys, active]);

  const onKeyDownTabs = (e) => {
    const idx = nav.findIndex((n) => n.key === active);
    if (idx < 0) return;

    const focusTabAt = (i) => {
      const list = tablistRef.current?.querySelectorAll('[role="tab"]');
      if (list && list[i]) list[i].focus();
    };

    switch (e.key) {
      case "ArrowDown":
      case "ArrowRight": {
        const next = (idx + 1) % nav.length;
        setActive(nav[next].key);
        focusTabAt(next);
        e.preventDefault();
        break;
      }
      case "ArrowUp":
      case "ArrowLeft": {
        const prev = (idx - 1 + nav.length) % nav.length;
        setActive(nav[prev].key);
        focusTabAt(prev);
        e.preventDefault();
        break;
      }
      case "Home":
        setActive(nav[0].key);
        focusTabAt(0);
        e.preventDefault();
        break;
      case "End":
        setActive(nav[nav.length - 1].key);
        focusTabAt(nav.length - 1);
        e.preventDefault();
        break;
      default:
    }
  };

  const renderPanel = (key) => {
    switch (key) {
      case "details":
        return <DetailsPanel data={details} />;
      case "questions":
        return wrapPanelContent(questions, "Keine Fragen vorhanden.");
      case "reviews":
        return wrapPanelContent(reviews, "Noch keine Bewertungen.");
      case "shipping":
        return wrapPanelContent(
          shipping,
          "Lieferinformationen momentan nicht verfügbar."
        );
      case "returns":
        return wrapPanelContent(
          returnsContent,
          "Rückgaberegeln momentan nicht verfügbar."
        );
      default:
        return null;
    }
  };

  return (
    <section className={`w-full py-10 ${className}`}>
      <div className="rounded-xl bg-white/80">
        <div className="py-4 md:py-5">
          <h2 className="text-[22px] md:text-[28px] font-regular text-gray-900 uppercase">
            {heading}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[280px_minmax(0,1fr)]">
          <div className="hidden md:block">
            <div
              role="tablist"
              aria-orientation="vertical"
              ref={tablistRef}
              onKeyDown={onKeyDownTabs}
              className="flex flex-col gap-3.5"
            >
              {nav.map((item) => {
                const isActive = item.key === active;
                return (
                  <button
                    key={item.key}
                    role="tab"
                    id={`${idPrefix}-tab-${item.key}`}
                    aria-selected={isActive}
                    aria-controls={`${idPrefix}-panel-${item.key}`}
                    tabIndex={isActive ? 0 : -1}
                    onClick={() => setActive(item.key)}
                    className={[
                      "w-full text-left rounded-l-xl px-5 py-4 font-regular",
                      "transition-colors outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 lg:text-[19px] text-[17px] text-[#7B849E]",
                      isActive
                        ? "bg-[#EAB308] text-white"
                        : "text-[#7B849E] border border-[#EEE1B4]",
                    ].join(" ")}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="hidden md:block border border-[#EEE1B4] rounded-b-2xl rounded-r-2xl">
            {nav.map((item) => {
              const isActive = item.key === active;
              return (
                <div
                  key={item.key}
                  role="tabpanel"
                  id={`${idPrefix}-panel-${item.key}`}
                  aria-labelledby={`${idPrefix}-tab-${item.key}`}
                  hidden={!isActive}
                  className="p-4 md:p-6"
                >
                  {isActive && renderPanel(item.key)}
                </div>
              );
            })}
          </div>

          <div className="md:hidden">
            <ul className="divide-y divide-gray-200">
              {nav.map((item) => {
                const isOpen = item.key === active;
                return (
                  <li key={item.key}>
                    <button
                      className="w-full flex items-center justify-between px-4 py-3 text-left text-sm font-medium text-gray-900"
                      aria-expanded={isOpen}
                      aria-controls={`${idPrefix}-m-panel-${item.key}`}
                      onClick={() =>
                        setActive(isOpen ? nav[0]?.key || "details" : item.key)
                      }
                    >
                      <span>{item.label}</span>
                      <svg
                        className={`h-5 w-5 transform transition-transform ${
                          isOpen ? "rotate-180" : ""
                        }`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    <div
                      id={`${idPrefix}-m-panel-${item.key}`}
                      role="region"
                      className={`px-4 pb-4 ${isOpen ? "block" : "hidden"}`}
                    >
                      {renderPanel(item.key)}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function wrapPanelContent(content, fallback) {
  return (
    <div className="prose max-w-none prose-p:my-3 prose-li:my-1 prose-headings:mt-6 prose-headings:mb-3">
      {content ?? <p className="text-gray-600">{fallback}</p>}
    </div>
  );
}

function DetailsPanel({ data }) {
  if (!data)
    return <p className="text-sm text-gray-600">Keine Details verfügbar.</p>;

  const { title, description = [], specs = [] } = data;

  return (
    <article className="space-y-5">
      <header className="space-y-1">
        <h3 className="text-lg md:text-xl font-semibold text-gray-900">
          {title}
        </h3>
      </header>

      <div className="space-y-3">
        {description.map((para, i) => (
          <p key={i} className="text-sm leading-6 text-gray-700">
            {para}
          </p>
        ))}
      </div>

      {specs.length > 0 && (
        <dl className="grid grid-cols-1 gap-x-6 gap-y-3 md:gap-y-6">
          {specs.map((item, idx) => (
            <div key={idx} className="flex gap-3">
              <dt className="w-40 shrink-0 md:text-[18px] text-[16px] font-semibold text-black">
                {item.label}
              </dt>
              <dd className="text-sm text-gray-900">{item.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </article>
  );
}
