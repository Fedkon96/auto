import React from "react";

export type IconId =
  | "icon-location"
  | "icon-check-circle"
  | "icon-calendar"
  | "icon-car"
  | "icon-fuel-pump"
  | "icon-gear"
  | string;

type Props = {
  id: IconId;
  size?: number; // px
  className?: string;
  title?: string;
  ariaHidden?: boolean;
};

export default function Icon({
  id,
  size = 16,
  className,
  title,
  ariaHidden = true,
}: Props) {
  const href = `/icons.svg#${id}`;
  const ariaProps = ariaHidden
    ? { "aria-hidden": true }
    : ({ role: "img", "aria-label": title || id } as const);
  return (
    <svg
      width={size}
      height={size}
      className={className}
      focusable="false"
      {...ariaProps}
    >
      {title && !ariaHidden ? <title>{title}</title> : null}
      <use href={href} />
    </svg>
  );
}
