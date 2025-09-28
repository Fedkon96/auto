"use client";

import React, { useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import styles from "./CarsList.module.css";
import { getCars } from "@/lib/api";
import formatNumberWithComma, { shortAddress } from "@/lib/format";
import { parseFilters, buildParams } from "@/lib/filter";
import type { CarSummary, CarsResponse } from "@/types/models";
import {
  useInfiniteQuery,
  InfiniteData,
  QueryFunctionContext,
} from "@tanstack/react-query";
import { useCarStore } from "@/lib/store/carStore";
import { useFavoritesStore } from "@/lib/store/favoritesStore";

export default function CarsList() {
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

  const infiniteQuery = useInfiniteQuery<CarsResponse, Error>({
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
      // Если известен totalCars, прекращаем когда всё загружено
      if (Number.isFinite(lastPage.totalCars) && loaded >= lastPage.totalCars) {
        return undefined;
      }
      // Если известны page/totalPages — используем их
      if (
        Number.isFinite(lastPage.page) &&
        Number.isFinite(lastPage.totalPages)
      ) {
        return lastPage.page < lastPage.totalPages
          ? lastPage.page + 1
          : undefined;
      }
      // Фоллбэк: пока приходят элементы — идём дальше
      if (Array.isArray(lastPage.cars) && lastPage.cars.length > 0) {
        return (allPages?.length ?? 1) + 1;
      }
      return undefined;
    },
    staleTime: 1000 * 60 * 2,
  });

  const pages =
    (infiniteQuery.data as InfiniteData<CarsResponse> | undefined)?.pages ?? [];
  const items: CarSummary[] = pages.flatMap((p) => p.cars);

  useEffect(() => {
    setPage(1);
  }, [searchKey, setPage]);

  if (infiniteQuery.isLoading)
    return <div className={styles.loading}>Loading cars...</div>;

  if (!items.length)
    return (
      <div className={styles.noResults}>
        No results for the selected filters. Try adjusting filters.
      </div>
    );

  return (
    <div>
      <ul className={styles.grid} role="list">
        {items.map((c) => {
          return (
            <li key={c.id} className={styles.card}>
              <div className={styles.image}>
                <button
                  type="button"
                  className={styles.favBtn}
                  aria-label={
                    favIds[c.id] ? "Remove from favorites" : "Add to favorites"
                  }
                  aria-pressed={!!favIds[c.id]}
                  onClick={() => toggleFav(c.id)}
                >
                  <svg className={styles.favIcon} aria-hidden="true">
                    <use
                      href={
                        favIds[c.id]
                          ? "/icons.svg#icon-heartFill"
                          : "/icons.svg#icon-heartStroke"
                      }
                    />
                  </svg>
                </button>
                <Image
                  src={c.img}
                  alt={`${c.brand} ${c.model}`}
                  className={styles.img}
                  width={276}
                  height={268}
                />
                <div className={styles.overlay} aria-hidden="true" />
              </div>
              <div className={styles.body}>
                <div className={styles.content}>
                  <div className={styles.header}>
                    <ul className={styles.title} role="list">
                      <li className={styles.brand}>{c.brand}</li>
                      <li className={styles.model}>{c.model}</li>
                      <li className={styles.year}>{c.year}</li>
                    </ul>
                    <div className={styles.price}>${c.rentalPrice}</div>
                  </div>
                  <ul className={styles.specs} role="list">
                    <li className={styles.spec}>{shortAddress(c.address)}</li>
                    <li className={styles.spec}>
                      <span className={styles.sep} aria-hidden="true" />
                      {c.rentalCompany}
                    </li>
                    <li className={styles.spec}>
                      <span className={styles.sep} aria-hidden="true" />
                      {c.type}
                    </li>
                    <li className={styles.spec}>
                      <span className={styles.sep} aria-hidden="true" />
                      {formatNumberWithComma(c.mileage)} km
                    </li>
                  </ul>
                </div>
                <div className={styles.actions}>
                  <Link href={`/catalog/${c.id}`} className={styles.button}>
                    Read more
                  </Link>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {items.length > 0 && infiniteQuery.hasNextPage ? (
        <div className={styles.loadMore}>
          <button
            className={`${styles.button} ${styles.loadMoreBtn}`}
            onClick={async () => {
              if (infiniteQuery.hasNextPage) {
                await infiniteQuery.fetchNextPage();
              }
            }}
            disabled={infiniteQuery.isFetchingNextPage}
          >
            {infiniteQuery.isFetchingNextPage ? "Loading..." : "Load more"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
