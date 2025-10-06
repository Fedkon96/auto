"use client";

import { useMemo, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useInfiniteQuery, QueryFunctionContext } from "@tanstack/react-query";
import { getCars } from "@/lib/api";
import { parseFilters, buildParams } from "@/lib/filter";
import type { CarsResponse, CarSummary } from "@/types/models";
import { useCarStore } from "@/lib/store/carStore";
import { useFavoritesStore } from "@/lib/store/favoritesStore";

/**
 * Хук инкапсулирует:
 *  - чтение query params
 *  - парсинг фильтров
 *  - infinite-загрузку
 *  - синхронизацию страницы в zustand
 *  - состояние избранного
 */
export function useCarsList() {
  const searchParamsRaw = useSearchParams();
  const searchKey = searchParamsRaw ? searchParamsRaw.toString() : "";

  const searchParams = useMemo(() => {
    if (!searchParamsRaw) return null;
    return new URLSearchParams(searchParamsRaw.toString());
  }, [searchParamsRaw]);

  const filters = useMemo(() => parseFilters(searchParams), [searchParams]);
  const setPage = useCarStore((s) => s.setPage);

  const toggleFav = useFavoritesStore((s) => s.toggle);
  const favIds = useFavoritesStore((s) => s.ids);

  const query = useInfiniteQuery<CarsResponse, Error>({
    queryKey: ["cars", searchKey],
    queryFn: (ctx: QueryFunctionContext) => {
      const page = Number((ctx.pageParam as number | undefined) ?? 1);
      return getCars(buildParams(filters, page));
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage: CarsResponse, allPages: CarsResponse[]) => {
      if (!lastPage) return undefined;
      const loaded = (allPages || []).reduce(
        (acc, p) => acc + (Array.isArray(p?.cars) ? p.cars.length : 0),
        0
      );

      if (Number.isFinite(lastPage.totalCars) && loaded >= lastPage.totalCars) {
        return undefined;
      }

      if (
        Number.isFinite(lastPage.page) &&
        Number.isFinite(lastPage.totalPages)
      ) {
        return lastPage.page < lastPage.totalPages
          ? lastPage.page + 1
          : undefined;
      }

      if (Array.isArray(lastPage.cars) && lastPage.cars.length > 0) {
        return (allPages?.length ?? 1) + 1;
      }
      return undefined;
    },
    staleTime: 1000 * 60 * 2,
  });

  const pages = query.data?.pages ?? [];
  const items: CarSummary[] = pages.flatMap((p) => p.cars);

  useEffect(() => {
    setPage(1); // сбрасываем page стор при изменении фильтров
  }, [searchKey, setPage]);

  const fetchNext = useCallback(async () => {
    if (query.hasNextPage) {
      await query.fetchNextPage();
    }
  }, [query]);

  return {
    items,
    isLoading: query.isLoading,
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    fetchNext,
    favIds,
    toggleFav,
  };
}
