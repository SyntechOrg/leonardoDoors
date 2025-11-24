"use client";

import { WishlistRow } from "@/mini-components/WishlistRow";
import { useCallback, useMemo } from "react";

export default function Wishlist() {
  const items = useMemo(
    () => [
      {
        id: "1",
        name: "Green Capsicum",
        price: { cur: "CHF", amount: "2,300" },
        inStock: true,
      },
      {
        id: "2",
        name: "Chinese Cabbage",
        price: { cur: "CHF", amount: "2,300" },
        inStock: false,
      },
    ],
    []
  );

  const onAdd = useCallback((id) => {
    console.log("add-to-cart", id);
  }, []);

  const onRemove = useCallback((id) => {
    console.log("remove", id);
  }, []);

  return (
    <section
      aria-labelledby="wishlist-title"
      className="mx-auto max-w-[1040px] px-4 py-20"
    >
      <h1
        id="wishlist-title"
        className="mb-7 mt-3 text-center text-[28px] font-bold text-ink"
      >
        My Wishlist
      </h1>

      <div
        role="table"
        aria-label="Wishlist items"
        className="overflow-hidden rounded-md border border-[#E6E6E6] bg-tableBg shadow-card"
      >
        <div
          role="row"
          className="grid grid-cols-[1.3fr_.8fr_.9fr_.7fr] items-center text-tiny uppercase tracking-wide text-muted"
        >
          <div role="columnheader" className="px-6 py-4 text-[#808080]">
            Produkt
          </div>
          <div role="columnheader" className="px-6 py-4 text-[#808080]">
            Preis
          </div>
          <div role="columnheader" className="px-6 py-4 text-[#808080]">
            Lagerstatus
          </div>
          {/* <div
            role="columnheader"
            aria-label="Actions"
            className="border-b border-[#E6E6E6] px-6 py-4"
          /> */}
        </div>

        {items.map((it) => (
          <WishlistRow
            key={it.id}
            name={it.name}
            currency={it.price.cur}
            amount={it.price.amount}
            inStock={it.inStock}
            onAdd={() => onAdd(it.id)}
            onRemove={() => onRemove(it.id)}
          />
        ))}
      </div>
    </section>
  );
}

