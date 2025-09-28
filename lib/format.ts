export function formatNumberWithComma(
  value: number | string | null | undefined
): string {
  if (value === null || value === undefined || value === "") return "";
  const num =
    typeof value === "number"
      ? value
      : Number(String(value).replace(/\s|,/g, ""));
  if (Number.isNaN(num)) return String(value);
  const parts = String(num).split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return parts.join(".");
}

export function shortAddress(address: string | null | undefined): string {
  if (!address) return "";
  const parts = String(address)
    .split(",")
    .map((p) => p.trim());
  return parts.slice(-2).join(", ");
}

export default formatNumberWithComma;
