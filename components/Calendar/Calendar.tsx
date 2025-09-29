"use client";

import React from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import type { SelectSingleEventHandler } from "react-day-picker";
import { enUS } from "date-fns/locale";
import type { Formatters } from "react-day-picker";
import styles from "./Calendar.module.css";

type Props = {
  value?: Date;
  onChange?: (date?: Date) => void;
  disabledBeforeToday?: boolean;
  className?: string;
};

const formatWeekdayName: Formatters["formatWeekdayName"] = (date) => {
  const map = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"] as const;
  return map[date.getDay()];
};

const enMon = {
  ...enUS,
  options: { ...enUS.options, weekStartsOn: 1 as const },
};

export default function Calendar({
  value,
  onChange,
  disabledBeforeToday = true,
  className,
}: Props) {
  const onSelect: SelectSingleEventHandler = (day) => {
    onChange?.(day ?? undefined);
  };

  return (
    <div className={`${styles.wrap} ${className ?? ""}`.trim()}>
      <DayPicker
        mode="single"
        navLayout="around"
        selected={value}
        onSelect={onSelect}
        disabled={disabledBeforeToday ? { before: new Date() } : undefined}
        locale={enMon}
        formatters={{ formatWeekdayName }}
        styles={{
          month_grid: { marginTop: 12, rowGap: 12 },
          month: { rowGap: 12 },
        }}
        className={styles.dp}
        initialFocus
      />
    </div>
  );
}
