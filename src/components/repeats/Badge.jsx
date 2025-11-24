export function Badge({ type = "in", children }) {
  const cls =
    type === "in"
      ? "bg-[#20B52633] text-[#2C742F]"
      : "bg-[#EA4B4833] text-[#EA4B48]";
  return (
    <span
      className={`inline-flex h-6 items-center rounded-md px-2 text-[12px] font-semibold ${cls}`}
    >
      {children}
    </span>
  );
}

export function ActionButton({ disabled, onClick, children, ariaLabel }) {
  const base =
    "inline-flex h-10 items-center justify-center rounded-full px-4 text-[14px] font-semibold transition-colors";
  const enabled =
    "bg-[#EAB308] text-white hover:cursor-pointer hover:bg-btnGoldHover focus:outline-none focus:ring-2 focus:ring-btnGold/40";
  const dis = "bg-[#F2F2F2] text-[#B3B3B3] cursor-not-allowed";
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      className={`${base} ${disabled ? dis : enabled}`}
    >
      {children}
    </button>
  );
}
