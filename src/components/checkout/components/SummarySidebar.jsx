import React, { memo } from "react";
import { formatCHF } from "@utils/currency";

function ItemMini({ item }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-14 w-12 overflow-hidden rounded border border-gray-200 bg-gray-50">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="h-full w-full object-cover"
          />
        ) : null}
      </div>
      <div className="min-w-0">
        <div className="truncate text-sm font-semibold text-gray-900">
          {item.name}
        </div>
        <div className="text-xs text-gray-600">{item.qty} Artikel</div>
        <div className="text-xs text-gray-800">{formatCHF(item.price)}</div>
      </div>
    </div>
  );
}

function SummarySidebar({
  totals,
  items,
  ctaText = "Weiter zum Versand",
  onCta,
  disabled = false,
}) {
  return (
    <aside className="rounded border border-gray-200 bg-white p-4 md:p-6">
      <h3 className="text-lg font-semibold text-gray-900">IHRE BESTELLUNG</h3>

      <p className="mt-2 text-xs text-gray-500">
        Überprüfen Sie alle Produkte, die Sie kaufen möchten
      </p>

      <div className="mt-4 space-y-3">
        {items.map((it) => (
          <ItemMini key={it.id} item={it} />
        ))}
      </div>

      <dl className="mt-5 space-y-4">
        {/* <div className="flex items-center justify-between">
          <dt className="text-sm text-gray-600">Zwischensumme</dt>
          <dd className="text-sm text-gray-900">
            {formatCHF(totals.subtotal)}
          </dd>
        </div> */}
        {/* <div className="flex items-center justify-between">
          <dt className="text-sm text-gray-600">Versand</dt>
          <dd className="text-sm text-gray-900">
            {formatCHF(totals.shipping)}
          </dd>
        </div> */}
        <div className="flex items-center justify-between">
          <dt className="text-sm text-gray-600">Preis</dt>
          <dd className="text-sm text-gray-900">
            {formatCHF(totals.subtotal)}
          </dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-sm text-gray-600">Rabatt 10%</dt>
          <dd className="text-sm text-gray-900">
            {formatCHF(totals.discount)}
          </dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-sm text-gray-600">Gesamtpreis</dt>
          <dd className="text-sm font-semibold text-red-600">
            {formatCHF(totals.grand)}
          </dd>
        </div>
      </dl>

      <button
        type="button"
        disabled={disabled}
        onClick={onCta}
        className="mt-6 w-full rounded bg-yellow-500 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-yellow-600 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500"
      >
        {ctaText}
      </button>
    </aside>
  );
}

export default memo(SummarySidebar);
