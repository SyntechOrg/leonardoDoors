const chf = new Intl.NumberFormat("de-CH", {
  style: "currency",
  currency: "CHF",
  minimumFractionDigits: 2,
});
export const formatCHF = (v) => chf.format(Number.isFinite(v) ? v : 0);
export const clamp = (n, min, max) => Math.min(Math.max(n, min), max);
