import { create } from "zustand";
import { persist } from "zustand/middleware";

type FavoritesState = {
  ids: Record<string, true>;
  toggle: (id: string) => void;
  isFav: (id: string) => boolean;
  clear: () => void;
};

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      ids: {},
      toggle: (id: string) =>
        set((s) => {
          const next = { ...s.ids };
          if (next[id]) delete next[id];
          else next[id] = true;
          return { ids: next };
        }),
      isFav: (id: string) => !!get().ids[id],
      clear: () => set({ ids: {} }),
    }),
    { name: "favorites-store" }
  )
);
