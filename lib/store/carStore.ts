import { create } from "zustand";
import { persist } from "zustand/middleware";

type Filters = {
  brand?: string;
  price?: number | string;
  fromKm?: number;
  toKm?: number;
};

type CarStore = {
  page: number;
  setPage: (p: number) => void;
  filters: Filters;
  setFilters: (f: Partial<Filters>) => void;
  resetFilters: () => void;
};

export const useCarStore = create<CarStore>()(
  persist(
    (set) => ({
      page: 1,
      setPage: (p: number) => set({ page: p }),
      filters: {},
      setFilters: (f: Partial<Filters>) =>
        set((s) => ({ filters: { ...s.filters, ...f } })),
      resetFilters: () => set({ filters: {}, page: 1 }),
    }),
    {
      name: "car-store",
      partialize: (state) => ({ page: state.page, filters: state.filters }),
      version: 1,
    }
  )
);
