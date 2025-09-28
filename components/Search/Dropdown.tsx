"use client";

import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import css from "./Search.module.css";

type Option = { label: string; value: string };

type DropdownProps = {
  value: string;
  onChange: (val: string) => void;
  options: Array<string | Option>;
  placeholder?: string;
  disabled?: boolean;
  minWidth?: number;
  ariaLabel?: string;
};

export default function Dropdown({
  value,
  onChange,
  options,
  placeholder = "Select",
  disabled,
  minWidth = 180,
  ariaLabel,
}: DropdownProps) {
  const controlRef = useRef<HTMLButtonElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const listId = useId();

  const normalized: Option[] = useMemo(
    () =>
      options.map((o) =>
        typeof o === "string" ? { label: o || placeholder, value: o } : o
      ),
    [options, placeholder]
  );

  const selectedIndex = useMemo(
    () => normalized.findIndex((o) => o.value === value),
    [normalized, value]
  );

  useEffect(() => {
    if (open) setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
  }, [open, selectedIndex]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        controlRef.current &&
        !controlRef.current.contains(target) &&
        listRef.current &&
        !listRef.current.contains(target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const commit = (idx: number) => {
    const next = normalized[idx];
    if (!next) return;
    onChange(next.value);
    setOpen(false);
    requestAnimationFrame(() => controlRef.current?.focus());
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (e.key === "ArrowDown" || e.key === "Down") {
      e.preventDefault();
      if (!open) {
        setOpen(true);
        return;
      }
      setActiveIndex((i) => Math.min(i + 1, normalized.length - 1));
    } else if (e.key === "ArrowUp" || e.key === "Up") {
      e.preventDefault();
      if (!open) {
        setOpen(true);
        return;
      }
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Home") {
      e.preventDefault();
      if (open) setActiveIndex(0);
    } else if (e.key === "End") {
      e.preventDefault();
      if (open) setActiveIndex(normalized.length - 1);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (!open) setOpen(true);
      else commit(activeIndex);
    } else if (e.key === "Escape" || e.key === "Esc") {
      if (open) {
        e.preventDefault();
        setOpen(false);
      }
    }
  };

  const label =
    selectedIndex >= 0 ? normalized[selectedIndex].label : placeholder;

  return (
    <div className={css.ddWrap} style={{ minWidth, maxWidth: minWidth }}>
      <button
        ref={controlRef}
        type="button"
        className={css.ddControl}
        onClick={() => !disabled && setOpen((o) => !o)}
        onKeyDown={onKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={ariaLabel || placeholder}
        disabled={disabled}
      >
        <span className={css.ddValue}>{label}</span>
        <span className={css.selectArrow} aria-hidden="true">
          <svg className={css.selectArrowIcon}>
            <use
              href={
                open
                  ? "/icons.svg#icon-arrowActive"
                  : "/icons.svg#icon-arrowNotActive"
              }
            />
          </svg>
        </span>
      </button>
      {open ? (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          className={css.ddList}
          tabIndex={-1}
        >
          {normalized.map((o, idx) => {
            const selected = o.value === value;
            const active = idx === activeIndex;
            return (
              <li
                key={o.value || `opt-${idx}`}
                role="option"
                aria-selected={selected}
                className={`${css.ddOption} ${selected ? css.ddOptionSelected : ""} ${active ? css.ddOptionActive : ""}`}
                onMouseEnter={() => setActiveIndex(idx)}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => commit(idx)}
              >
                {o.label}
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
