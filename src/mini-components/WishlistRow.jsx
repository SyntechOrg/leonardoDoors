import { memo } from "react";
import { Badge } from "../components/repeats/Badge";
import { ActionButton } from "../components/repeats/Badge";

function PlaceholderThumb() {
  const src =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' width='56' height='72' viewBox='0 0 56 72'>
         <rect width='56' height='72' rx='6' fill='#EDEFF2'/>
         <rect x='16' y='12' width='24' height='48' rx='3' fill='#9AA3AF'/>
       </svg>`
    );
  return (
    <img
      src={src}
      width={56}
      height={72}
      alt=""
      className="block h-[72px] w-[56px] rounded-md"
      decoding="async"
      loading="lazy"
    />
  );
}

export const WishlistRow = memo(function WishlistRow({
  name,
  currency = "CHF",
  amount = "0",
  inStock,
  onAdd,
  onRemove,
}) {
  return (
    <div
      role="row"
      className="grid grid-cols-[1.4fr_.8fr_.9fr_.7fr] items-center border-t border-[#E6E6E6] first:border-t-0"
    >
      <div role="cell" className="px-6 py-[22px] min-w-[240px]">
        <div className="flex items-center gap-4">
          <PlaceholderThumb />
          <span className="text-[14px] text-ink">{name}</span>
        </div>
      </div>

      <div role="cell" className="px-6 py-[22px]">
        <span className="mr-1 text-[13px] font-semibold text-gray-500">
          {currency}
        </span>
        <span className="font-semibold text-ink">{amount}</span>
      </div>

      <div role="cell" className="px-6 py-[22px]">
        {inStock ? (
          <Badge type="in">Auf Lager</Badge>
        ) : (
          <Badge type="out">Nicht auf Lager</Badge>
        )}
      </div>

      <div
        role="cell"
        className="flex items-center justify-end gap-3 px-5 py-[22px]"
      >
        <ActionButton
          disabled={!inStock}
          onClick={onAdd}
          ariaLabel={`Add ${name} to cart`}
        >
          In den Warenkorb
        </ActionButton>

        <button
          type="button"
          aria-label={`Remove ${name} from wishlist`}
          onClick={onRemove}
          className="inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300/60"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M18 6 6 18M6 6l12 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
});
