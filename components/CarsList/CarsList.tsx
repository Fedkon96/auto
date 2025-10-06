"use client";

import React from "react";
import styles from "./CarsList.module.css";
import { CarCard } from "./CarCard";
import { useCarsList } from "./useCarsList";

export default function CarsList() {
  const {
    items,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNext,
    favIds,
    toggleFav,
  } = useCarsList();

  if (isLoading) return <div className={styles.loading}>Loading cars...</div>;

  if (!items.length)
    return (
      <div className={styles.noResults}>
        No results for the selected filters. Try adjusting filters.
      </div>
    );

  return (
    <div>
      <ul className={styles.grid} role="list">
        {items.map((c) => (
          <CarCard
            key={c.id}
            car={c}
            isFavorite={!!favIds[c.id]}
            onToggleFavorite={toggleFav}
          />
        ))}
      </ul>
      {items.length > 0 && hasNextPage && (
        <div className={styles.loadMore}>
          <button
            className={`${styles.button} ${styles.loadMoreBtn}`}
            onClick={fetchNext}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? "Loading..." : "Load more"}
          </button>
        </div>
      )}
    </div>
  );
}
