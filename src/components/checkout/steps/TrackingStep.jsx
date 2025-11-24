import React from "react";
import { useCheckout } from "../store/CheckoutProvider";

const STEPS = [
  {
    label: "Bestellung vom Verkäufer bestätigt",
    date: "19. Juli 2025 - 09:00 Uhr",
  },
  {
    label: "Paket bei DHL Schweiz empfangen",
    date: "19. Juli 2025 - 12:00 Uhr",
  },
  {
    label: "Paket von DHL Schweiz versendet",
    date: "20. Juli 2025 - 08:00 Uhr",
  },
  {
    label: "Paket bei DHL Schweiz angekommen",
    date: "20. Juli 2025 - 20:00 Uhr",
  },
  {
    label: "Paket wird von unserem Kurier zu Ihnen nach Hause gesendet",
    date: "21. Juli 2025 - 10:00 Uhr",
  },
];

export default function TrackingStep() {
  const { state } = useCheckout();

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,1fr)_360px]">
      <section className="rounded border border-gray-200 bg-white p-4 md:p-6">
        <h4 className="mb-4 text-base font-semibold">VERSAND IN</h4>
        <p className="text-sm text-gray-600">
          Wird an die {state.customer.address1 || "Ihre Adresse"},{" "}
          {state.customer.zip || ""} {state.customer.city || ""},{" "}
          {state.customer.country || ""} gesendet.
        </p>
        <ol className="mt-6 space-y-4">
          {STEPS.map((s, i) => (
            <li key={i} className="relative pl-6">
              <span
                className={`absolute left-0 top-1.5 h-3 w-3 rounded-full ${
                  i === STEPS.length - 1 ? "bg-yellow-500" : "bg-gray-300"
                }`}
              />
              <div className="text-sm text-gray-900">{s.label}</div>
              <div className="text-xs text-gray-500">{s.date}</div>
            </li>
          ))}
        </ol>

        <div className="mt-8">
          <p className="text-sm text-gray-700">
            Gab es Probleme mit Ihrem Paket?
          </p>
          <button className="mt-3 rounded border border-gray-300 px-4 py-2 text-sm">
            041 850 66 66
          </button>
        </div>
      </section>

      <section className="rounded border border-gray-200 bg-white p-4 md:p-6">
        <h3 className="text-lg font-semibold text-gray-900">IHRE BESTELLUNG</h3>
      </section>
    </div>
  );
}
