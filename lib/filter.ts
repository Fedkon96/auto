import type { CarFilters } from "@/types/models";

export function parseFilters(searchParams: URLSearchParams | null): CarFilters {
  const params: CarFilters = {};
  if (!searchParams) return params;
  const b = searchParams.get("brand");
  const p = searchParams.get("rentalPrice");
  const min = searchParams.get("minMileage");
  const max = searchParams.get("maxMileage");
  if (b) params.brand = b;
  if (p) {
    const num = String(p).replace(/[^0-9.-]+/g, "");
    if (num !== "") params.rentalPrice = Number(num);
  }
  if (min) {
    const num = String(min).replace(/[^0-9.-]+/g, "");
    if (num !== "") params.minMileage = Number(num);
  }
  if (max) {
    const num = String(max).replace(/[^0-9.-]+/g, "");
    if (num !== "") params.maxMileage = Number(num);
  }
  return params;
}

export function buildParams(filters: CarFilters, page?: number) {
  const out: Record<string, string | number | undefined> = {};
  if (filters.brand) out.brand = filters.brand;
  if (filters.brand) out["make"] = filters.brand;
  if (filters.rentalPrice != null) {
    const priceNum = Number(filters.rentalPrice);
    out.rentalPrice = `$${priceNum}`;
    out["price"] = priceNum;
  }
  if (filters.minMileage != null) {
    out.minMileage = filters.minMileage;
    out["mileageFrom"] = filters.minMileage;
  }
  if (filters.maxMileage != null) {
    out.maxMileage = filters.maxMileage;
    out["mileageTo"] = filters.maxMileage;
  }
  out.limit = 12;
  if (page !== undefined) out.page = page;
  return out;
}
