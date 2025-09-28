"use client";

import { useEffect, useId, useState } from "react";
import { useRouter } from "next/navigation";
import css from "./Search.module.css";
import { fetchCarsBrands } from "@/lib/api";
import Dropdown from "./Dropdown";
import { RiResetLeftFill } from "react-icons/ri";
import formatNumberWithComma from "@/lib/format";

const PRICES = Array.from({ length: (500 - 30) / 10 + 1 }, (_, i) =>
  String(30 + i * 10)
);

export default function Search() {
  const router = useRouter();
  const idBrand = useId();
  const idPrice = useId();
  const idMin = useId();
  const idMax = useId();
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState(""); // UI like "$80"
  const [fromKm, setFromKm] = useState<string>(""); // minMileage
  const [toKm, setToKm] = useState<string>(""); // maxMileage
  const [brands, setBrands] = useState<string[]>([]);
  // no loading UI state for brands to avoid dropdown flicker
  const [brandsError, setBrandsError] = useState<string | null>(null);
  const [spinReset, setSpinReset] = useState(false);
  // Dropdown handles its own open/close state; no local arrow state needed

  const FROM_PREFIX = "From ";
  const TO_PREFIX = "To ";

  const handleFromKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    const min = FROM_PREFIX.length;
    const start = input.selectionStart ?? 0;
    const end = input.selectionEnd ?? 0;
    if (
      (e.key === "Backspace" && start <= min && start === end) ||
      (e.key === "ArrowLeft" && start <= min)
    ) {
      e.preventDefault();
      input.setSelectionRange(min, min);
    }
  };

  const handleToKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    const min = TO_PREFIX.length;
    const start = input.selectionStart ?? 0;
    const end = input.selectionEnd ?? 0;
    if (
      (e.key === "Backspace" && start <= min && start === end) ||
      (e.key === "ArrowLeft" && start <= min)
    ) {
      e.preventDefault();
      input.setSelectionRange(min, min);
    }
  };

  useEffect(() => {
    let mounted = true;
    fetchCarsBrands()
      .then((data) => {
        if (!mounted) return;
        setBrands(data || []);
      })
      .catch((err) => {
        console.error("Failed to load brands", err);
        if (!mounted) return;
        setBrandsError("Failed to load brands");
      })
      .finally(() => {
        /* no-op: keep UI stable during brand loading */
      });

    return () => {
      mounted = false;
    };
  }, []);

  const handleSubmit = (formData: FormData) => {
    const params = new URLSearchParams();
    const fdBrand = String(formData.get("brand") ?? "").trim();
    const fdPrice = String(formData.get("rentalPrice") ?? "");
    const fdMin = String(formData.get("minMileage") ?? "");
    const fdMax = String(formData.get("maxMileage") ?? "");

    if (fdBrand) params.set("brand", fdBrand);
    if (fdPrice) {
      const numeric = fdPrice.replace(/[^0-9.-]+/g, "");
      if (numeric) params.set("rentalPrice", numeric);
    }
    if (fdMin) {
      const cleaned = fdMin.replace(/\D+/g, "");
      if (cleaned) params.set("minMileage", cleaned);
    }
    if (fdMax) {
      const cleaned = fdMax.replace(/\D+/g, "");
      if (cleaned) params.set("maxMileage", cleaned);
    }

    const url = `/catalog${params.toString() ? `?${params.toString()}` : ""}`;
    router.push(url);
  };

  return (
    <form className={css.search} action={handleSubmit} aria-label="car search">
      <ul className={css.row}>
        <li className={css.groupBrand}>
          <label className={css.label} htmlFor={idBrand}>
            Car brand
          </label>
          <input
            type="hidden"
            name="brand"
            id={idBrand}
            value={brand}
            readOnly
          />
          <Dropdown
            value={brand}
            onChange={setBrand}
            options={brands}
            placeholder={"Choose a brand"}
            disabled={false}
            ariaLabel="Choose a brand"
            minWidth={204}
          />
          {brandsError ? <div className={css.error}>{brandsError}</div> : null}
        </li>

        <li className={css.groupPrice}>
          <label className={css.label} htmlFor={idPrice}>
            Price / 1 hour
          </label>
          <input
            type="hidden"
            name="rentalPrice"
            id={idPrice}
            value={price}
            readOnly
          />
          <Dropdown
            value={price}
            onChange={setPrice}
            options={PRICES}
            placeholder="Choose a price"
            ariaLabel="Choose a price"
            minWidth={196}
          />
        </li>

        <li className={css.groupInline}>
          <label className={css.label}>Car mileage / km</label>
          <div className={css.split}>
            <input
              id={idMin}
              name="minMileage"
              type="text"
              inputMode="numeric"
              className={`${css.input} ${css.inputWithPrefix}`}
              value={`${FROM_PREFIX}${formatNumberWithComma(fromKm)}`}
              onChange={(e) => {
                // strip prefix and non-digits
                const raw = e.target.value.slice(FROM_PREFIX.length);
                const cleaned = raw.replace(/\D+/g, "");
                setFromKm(cleaned);
              }}
              onFocus={(e) => {
                const min = FROM_PREFIX.length;
                requestAnimationFrame(() =>
                  e.currentTarget.setSelectionRange(min, min)
                );
              }}
              onClick={(e) => {
                const min = FROM_PREFIX.length;
                if ((e.currentTarget.selectionStart ?? 0) < min) {
                  e.currentTarget.setSelectionRange(min, min);
                }
              }}
              onKeyDown={handleFromKeyDown}
              aria-label="From"
            />
            <input
              id={idMax}
              name="maxMileage"
              type="text"
              inputMode="numeric"
              className={`${css.input} ${css.inputWithPrefix} ${css.leftBorder}`}
              value={`${TO_PREFIX}${formatNumberWithComma(toKm)}`}
              onChange={(e) => {
                const raw = e.target.value.slice(TO_PREFIX.length);
                const cleaned = raw.replace(/\D+/g, "");
                setToKm(cleaned);
              }}
              onFocus={(e) => {
                const min = TO_PREFIX.length;
                requestAnimationFrame(() =>
                  e.currentTarget.setSelectionRange(min, min)
                );
              }}
              onClick={(e) => {
                const min = TO_PREFIX.length;
                if ((e.currentTarget.selectionStart ?? 0) < min) {
                  e.currentTarget.setSelectionRange(min, min);
                }
              }}
              onKeyDown={handleToKeyDown}
              aria-label="To"
            />
          </div>
        </li>

        <li className={css.action}>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              type="submit"
              className={`${css.buttonSearch} ${css.buttonPrimary}`}
              aria-label="Search"
            >
              Search
            </button>
            <button
              type="button"
              className={css.buttonReset}
              aria-label="Reset filters"
              onClick={() => {
                setBrand("");
                setPrice("");
                setFromKm("");
                setToKm("");
                router.push("/catalog");
                setSpinReset(true);
              }}
            >
              <RiResetLeftFill
                className={`${css.iconReset} ${spinReset ? css.iconResetSpin : ""}`}
                onAnimationEnd={() => setSpinReset(false)}
              />
            </button>
          </div>
        </li>
      </ul>
    </form>
  );
}
