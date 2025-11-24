import React from "react";
import { clamp } from "@utils/currency";

const STEPS = [
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
];

export default function ProgressHeader({ current = 0, onStepChange }) {
  const pct = current <= 0 ? 0 : (current / (STEPS.length - 1)) * 100;

  const keyNav = (e, i) => {
    if (e.key === "ArrowRight") {
      onStepChange?.(clamp(i + 1, 0, STEPS.length - 1));
      e.preventDefault();
    }
    if (e.key === "ArrowLeft") {
      onStepChange?.(clamp(i - 1, 0, STEPS.length - 1));
      e.preventDefault();
    }
    if (e.key === "Home") {
      onStepChange?.(0);
      e.preventDefault();
    }
    if (e.key === "End") {
      onStepChange?.(STEPS.length - 1);
      e.preventDefault();
    }
  };

  return (
    <section className="w-full">
      <h1 className="text-center font-extrabold tracking-wide text-gray-900 text-2xl md:text-3xl">
        CHECKOUT
      </h1>
      <p className="mt-2 text-center text-xs md:text-[13px] text-gray-500">
        WÄHLEN SIE DIE ZAHLUNGS- UND VERSANDMETHODEN, DIE SIE WÜNSCHEN
      </p>

      <div className="mx-auto mt-6 max-w-5xl px-4">
        <div className="relative h-[2px] bg-gray-200">
          <div
            className="absolute inset-y-0 left-0 bg-yellow-500 transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>

        <ol className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          {STEPS.map((s, i) => {
            const active = i <= current;
            const currentStep = i === current;
            return (
              <li key={s.key} className="flex items-start gap-3">
                <button
                  type="button"
                  aria-current={currentStep ? "step" : undefined}
                  onKeyDown={(e) => keyNav(e, i)}
                  onClick={() => onStepChange?.(i)}
                  className={[
                    "shrink-0 inline-flex h-10 w-10 items-center justify-center rounded-full border-2",
                    "outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-yellow-500",
                    active
                      ? "bg-yellow-500 border-yellow-500 text-white"
                      : "bg-white border-gray-300 text-gray-500",
                  ].join(" ")}
                >
                  <span className="text-lg leading-none">•</span>
                </button>
                <div className="pt-1">
                  <div
                    className={[
                      "text-[11px] md:text-xs font-semibold tracking-wide",
                      active ? "text-gray-900" : "text-gray-500",
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
