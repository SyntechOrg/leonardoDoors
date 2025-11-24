import React, { useMemo, useState } from "react";

/* ---------- Utilities ---------- */

// Simple Swiss Franc formatting (adjust locale/currency as required)
function formatCHF(value) {
  try {
    return new Intl.NumberFormat("de-CH", {
      style: "currency",
      currency: "CHF",
      minimumFractionDigits: 2,
    }).format(value);
  } catch {
    // Fallback
    return `CHF ${Number(value).toFixed(2)}`;
  }
}

// Clamp helper
const clamp = (n, min, max) => Math.min(Math.max(n, min), max);

/* ---------- Progress Tracker (Top Section) ---------- */

function CheckoutProgress({ current = 0, onStepChange }) {
  // Steps as in your image (German labels and helper text)
  const steps = useMemo(
    () => [
      {
        key: "cart",
        label: "WARENKORB",
        desc: "Überprüfen Sie alle Ihre Produkte und bearbeiten Sie die Anzahl.",
      },
      {
        key: "customer",
        label: "KUNDENINFORMATIONEN",
        desc: "Fügen Sie Ihren Namen, Ihre Telefonnummer und Ihre Adresse hinzu.",
      },
      // {
      //   key: "confirmation",
      //   label: "BESTÄTIGUNG",
      //   desc: "Ihre Bestellung wurde erfolgreich übermittelt.",
      // },
      // {
      //   key: "shipping",
      //   label: "VERSAND & ZAHLUNG",
      //   desc: "Wählen Sie Zahlungsmethoden, einschließlich Ihrer.",
      // },
      // {
      //   key: "review",
      //   label: "ÜBERPRÜFUNG",
      //   desc: "Überprüfen Sie alle Ihre Informationen vor der Bestätigung.",
      // },
    ],
    []
  );

  const total = steps.length;
  const pct = current <= 0 ? 0 : (current / (total - 1)) * 100;

  // Keyboard navigation for steps
  const handleKey = (e, idx) => {
    if (e.key === "ArrowRight") {
      onStepChange?.(clamp(idx + 1, 0, total - 1));
      e.preventDefault();
    }
    if (e.key === "ArrowLeft") {
      onStepChange?.(clamp(idx - 1, 0, total - 1));
      e.preventDefault();
    }
    if (e.key === "Home") {
      onStepChange?.(0);
      e.preventDefault();
    }
    if (e.key === "End") {
      onStepChange?.(total - 1);
      e.preventDefault();
    }
  };

  return (
    <section className="w-full">
      <h1 className="text-center font-extrabold tracking-wide text-gray-900 text-2xl md:text-3xl">
        EINKAUFSWAGEN
      </h1>
      <p className="mt-2 text-center text-xs md:text-[13px] text-gray-500">
        DAS IST IHR WARENKORB BASIEREND AUF DEM, WAS SIE KAUFEN WOLLTEN
      </p>

      {/* Progress Bar */}
      <div className="mx-auto mt-6 max-w-5xl px-4">
        <div className="relative h-[2px] bg-gray-200">
          <div
            className="absolute inset-y-0 left-0 bg-yellow-500 transition-all"
            style={{ width: `${pct}%` }}
            aria-hidden="true"
          />
        </div>

        {/* Steps */}
        <ol
          className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4"
          role="list"
          aria-label="Checkout steps"
        >
          {steps.map((s, idx) => {
            const isActive = idx <= current; // active and completed look filled
            const isCurrent = idx === current;
            return (
              <li key={s.key} className="flex items-start gap-3">
                {/* Icon bubble */}
                <button
                  type="button"
                  aria-current={isCurrent ? "step" : undefined}
                  aria-label={`${s.label}${isCurrent ? " (aktuell)" : ""}`}
                  onClick={() => onStepChange?.(idx)}
                  onKeyDown={(e) => handleKey(e, idx)}
                  className={[
                    "shrink-0 inline-flex h-10 w-10 items-center justify-center rounded-full border-2",
                    "outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-yellow-500",
                    isActive
                      ? "bg-yellow-500 border-yellow-500 text-white"
                      : "bg-white border-gray-300 text-gray-500",
                  ].join(" ")}
                >
                  {/* Lock/cart icons are decorative in screenshot; we use a simple emblem */}
                  <span className="text-lg leading-none">•</span>
                </button>

                {/* Labels */}
                <div className="pt-1">
                  <div
                    className={[
                      "text-[11px] md:text-xs font-semibold tracking-wide",
                      isActive ? "text-gray-900" : "text-gray-500",
                    ].join(" ")}
                  >
                    {s.label}
                  </div>
                  <p className="mt-1 text-[11px] leading-5 text-gray-500 hidden md:block">
                    {s.desc}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

/* ---------- Cart Row (Left Column) ---------- */

function CartItemRow({
  thumbnail,
  title,
  rating = 5,
  variant = 'Typ: 78" x 30" Kolonial (44mm)',
  colorSwatches = ["#6D7377", "#2F2F2F", "#6F3A59"],
  unitPrice = 2300,
  quantity,
  setQuantity,
}) {
  const dec = () => setQuantity((q) => clamp(q - 1, 1, 999));
  const inc = () => setQuantity((q) => clamp(q + 1, 1, 999));

  return (
    <div className="flex flex-col md:flex-row gap-4 md:gap-6">
      {/* Image */}
      <div className="w-full md:w-40">
        <div className="aspect-[3/5] w-full overflow-hidden rounded border border-gray-200 bg-gray-50">
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={title}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="h-full w-full" />
          )}
        </div>
      </div>

      {/* Details */}
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900 text-sm md:text-base">
          {title}
        </h3>

        {/* Rating stars (static) */}
        <div className="mt-1 flex items-center gap-1" aria-hidden="true">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg
              key={i}
              className={`h-4 w-4 ${
                i < rating ? "text-amber-400" : "text-gray-300"
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.802 2.036a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118L10.5 13.348a1 1 0 00-1.175 0l-2.985 2.125c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.7 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.349-3.292z" />
            </svg>
          ))}
        </div>

        {/* Variant pill */}
        <div className="mt-3 inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs text-gray-600">
          {variant}
        </div>

        {/* Swatches */}
        <div className="mt-3 flex items-center gap-2">
          {colorSwatches.map((hex, i) => (
            <span
              key={hex + i}
              className="h-6 w-6 rounded-sm border border-gray-300"
              style={{ backgroundColor: hex }}
              aria-hidden="true"
            />
          ))}
        </div>

        {/* Qty controls */}
        <div className="mt-4 inline-flex items-stretch overflow-hidden rounded border border-gray-200">
          <button
            onClick={dec}
            className="px-3 py-2 text-gray-700 hover:bg-gray-50 disabled:opacity-40"
            disabled={quantity <= 1}
            aria-label="Menge verringern"
          >
            −
          </button>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={quantity}
            onChange={(e) => {
              const v = e.target.value.replace(/[^\d]/g, "");
              const num = v === "" ? 1 : parseInt(v, 10);
              setQuantity(clamp(num, 1, 999));
            }}
            className="w-12 text-center outline-none"
            aria-label="Menge"
          />
          <button
            onClick={inc}
            className="px-3 py-2 text-gray-700 hover:bg-gray-50"
            aria-label="Menge erhöhen"
          >
            +
          </button>
        </div>

        {/* Unit price (as in image right under block) – optional */}
        <div className="mt-4 font-semibold text-gray-800">
          {formatCHF(unitPrice)}
        </div>
      </div>
    </div>
  );
}

/* ---------- Order Summary (Right Column) ---------- */

function OrderSummary({ price, discountRate = 0.1, onContinue }) {
  const discountValue = price * discountRate;
  const final = Math.max(0, price - discountValue);

  return (
    <aside className="rounded border border-gray-200 bg-white p-4 md:p-6">
      <h3 className="text-lg font-semibold text-gray-900">BESTELLÜBERSICHT</h3>

      <dl className="mt-5 space-y-4">
        <div className="flex items-center justify-between">
          <dt className="text-sm text-gray-600">Preis</dt>
          <dd className="text-sm text-gray-900">{formatCHF(price)}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-sm text-gray-600">Rabatt 10%</dt>
          <dd className="text-sm text-gray-900">{formatCHF(discountValue)}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-sm text-gray-600">Gesamtpreis</dt>
          <dd className="text-sm font-semibold text-red-600">
            {formatCHF(final)}
          </dd>
        </div>
      </dl>

      <button
        type="button"
        onClick={onContinue}
        className="mt-6 w-full rounded bg-yellow-500 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-yellow-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500"
      >
        Weiter zum Versand
      </button>
    </aside>
  );
}

/* ---------- Main Cart View ---------- */

export default function CartView() {
  // Simulated state
  const [step, setStep] = useState(0); // 0..3
  const [qty, setQty] = useState(1);
  const unitPrice = 2300; // Example price
  const subtotal = unitPrice * qty;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:py-12">
      {/* Progress Header */}
      <CheckoutProgress current={step} onStepChange={setStep} />

      {/* Content */}
      <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,1fr)_360px]">
        {/* Left column (cart items) */}
        <div className="space-y-6">
          <div className="rounded border border-gray-200 bg-white p-4 md:p-6">
            <CartItemRow
              thumbnail="https://images.unsplash.com/photo-1505691723518-36a5ac3b2a59?auto=format&fit=crop&w=268&q=80"
              title="Aluminium-Fronttür 30402D"
              quantity={qty}
              setQuantity={setQty}
              unitPrice={unitPrice}
            />
          </div>
        </div>

        {/* Right column (summary) */}
        <div>
          <OrderSummary
            price={subtotal}
            discountRate={0.1}
            onContinue={() => setStep((s) => clamp(s + 1, 0, 3))}
          />
        </div>
      </div>
    </div>
  );
}
