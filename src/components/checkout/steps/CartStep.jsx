import React from "react";
import { useCheckout } from "../store/CheckoutProvider";
import { useCart } from "@utils/useCart";
import SummarySidebar from "../components/SummarySidebar";
import { clamp, formatCHF } from "@utils/currency";
import { HiTrash } from "react-icons/hi2";

function CartRow({ item, onQty, onRemove }) {
  return (
    <div className="flex flex-col md:flex-row gap-4 md:gap-6">
      <div className="w-full md:w-40">
        <div className="aspect-[3/5] w-full overflow-hidden rounded border border-gray-200 bg-gray-50">
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              className="h-full w-full object-cover"
            />
          ) : null}
        </div>
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-gray-900 text-sm md:text-base">
              {item.name}
            </h3>
            <div className="mt-3 inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs text-gray-600">
              {item.options?.variant}
            </div>
            <div className="mt-3 flex items-center gap-2">
              {item.options?.color ? (
                <span
                  className="h-6 w-6 rounded-sm border border-gray-300"
                  style={{ backgroundColor: item.options.color }}
                />
              ) : null}
            </div>
          </div>
          <button
            onClick={() => onRemove(item.id)}
            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
            title="Artikel entfernen"
          >
            <HiTrash className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 inline-flex items-stretch overflow-hidden rounded border border-gray-200">
          <button
            onClick={() => onQty(item.id, clamp(item.qty - 1, 1, 999))}
            className="px-3 py-2 text-gray-700 hover:bg-gray-50"
            aria-label="Menge verringern"
          >
            −
          </button>
          <input
            className="w-12 text-center outline-none"
            value={item.qty}
            onChange={(e) =>
              onQty(
                item.id,
                clamp(
                  parseInt(e.target.value.replace(/[^\d]/g, ""), 10) || 1,
                  1,
                  999
                )
              )
            }
          />
          <button
            onClick={() => onQty(item.id, clamp(item.qty + 1, 1, 999))}
            className="px-3 py-2 text-gray-700 hover:bg-gray-50"
            aria-label="Menge erhöhen"
          >
            +
          </button>
        </div>

        <div className="mt-4 font-semibold text-gray-800">
          {formatCHF(item.price * item.qty)}
        </div>
      </div>
    </div>
  );
}

export default function CartStep() {
  const { state, dispatch } = useCheckout();
  const { removeItem } = useCart();
  console.log("Cart items:", state.cart.items);

  const updateQty = (id, qty) => {
    dispatch({ type: "UPDATE_ITEM_QTY", id, qty });
  };

  const handleRemove = (id) => {
    if (window.confirm("Möchten Sie diesen Artikel wirklich entfernen?")) {
      removeItem(id);
    }
  };

  if (!state.cart.items || state.cart.items.length === 0) {
    return (
      <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,1fr)_360px]">
        <div className="rounded border border-gray-200 bg-white p-4 md:p-6 text-center">
          <p className="text-gray-500 py-12">Ihr Warenkorb ist leer.</p>
        </div>
        <SummarySidebar
          totals={state.meta.totals}
          items={state.cart.items}
          ctaText="Weiter zu den Kundendaten"
          onCta={() => dispatch({ type: "SET_STEP", step: 1 })}
          disabled={true}
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,1fr)_360px]">
      <div className="rounded border border-gray-200 bg-white p-4 md:p-6">
        {state.cart.items.map((it) => (
          <div
            key={it.id}
            className="py-4 first:pt-0 last:pb-0 border-b last:border-b-0 border-gray-100"
          >
            <CartRow item={it} onQty={updateQty} onRemove={handleRemove} />
          </div>
        ))}
      </div>

      <SummarySidebar
        totals={state.meta.totals}
        items={state.cart.items}
        ctaText="Weiter zu den Kundendaten"
        onCta={() => dispatch({ type: "SET_STEP", step: 1 })}
        disabled={state.cart.items.length === 0}
      />
    </div>
  );
}
