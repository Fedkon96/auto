"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import type { CarSummary } from "@/types/models";
import styles from "./CarsList.module.css";
import formatNumberWithComma, { shortAddress } from "@/lib/format";

interface CarCardProps {
  car: CarSummary;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

export const CarCard: React.FC<CarCardProps> = ({
  car,
  isFavorite,
  onToggleFavorite,
}) => {
  return (
    <li className={styles.card}>
      <div className={styles.image}>
        <button
          type="button"
          className={styles.favBtn}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          aria-pressed={isFavorite}
          onClick={() => onToggleFavorite(car.id)}
        >
          <svg className={styles.favIcon} aria-hidden="true">
            <use
              href={
                isFavorite
                  ? "/icons.svg#icon-heartFill"
                  : "/icons.svg#icon-heartStroke"
              }
            />
          </svg>
        </button>
        <Image
          src={car.img}
          alt={`${car.brand} ${car.model}`}
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
              <li className={styles.brand}>{car.brand}</li>
              <li className={styles.model}>{car.model}</li>
              <li className={styles.year}>{car.year}</li>
            </ul>
            <div className={styles.price}>${car.rentalPrice}</div>
          </div>
          <ul className={styles.specs} role="list">
            <li className={styles.spec}>{shortAddress(car.address)}</li>
            <li className={styles.spec}>
              <span className={styles.sep} aria-hidden="true" />
              {car.rentalCompany}
            </li>
            <li className={styles.spec}>
              <span className={styles.sep} aria-hidden="true" />
              {car.type}
            </li>
            <li className={styles.spec}>
              <span className={styles.sep} aria-hidden="true" />
              {formatNumberWithComma(car.mileage)} km
            </li>
          </ul>
        </div>
        <div className={styles.actions}>
          <Link href={`/catalog/${car.id}`} className={styles.button}>
            Read more
          </Link>
        </div>
      </div>
    </li>
  );
};
