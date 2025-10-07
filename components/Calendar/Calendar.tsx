"use client";

import React, { useMemo } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import type { SelectSingleEventHandler, Matcher } from "react-day-picker";
import { enUS } from "date-fns/locale";
import type { Formatters } from "react-day-picker";
import styles from "./Calendar.module.css";

type Props = {
  value?: Date;
  onChange?: (date?: Date) => void;
  disabledBeforeToday?: boolean;
  className?: string;
  /** Минимально допустимая дата (включительно). Если указана, перекрывает disabledBeforeToday. */
  minDate?: Date;
  /** Максимально допустимая дата (включительно). */
  maxDate?: Date;
  /** Отключить выбор выходных (суббота/воскресенье). */
  disableWeekends?: boolean;
  /** С какого дня начинается неделя: 0 (вс) ... 6 (сб). По умолчанию 1 (понедельник). */
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
};

const formatWeekdayName: Formatters["formatWeekdayName"] = (date) => {
  const map = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"] as const;
  return map[date.getDay()];
};

export default function Calendar({
  value,
  onChange,
  disabledBeforeToday = true,
  className,
  minDate,
  maxDate,
  disableWeekends = false,
  weekStartsOn = 1,
}: Props) {
  const onSelect: SelectSingleEventHandler = (day) => {
    // Избегаем лишних вызовов если дата не изменилась
    if (day?.getTime() === value?.getTime() || (!day && !value)) {
      return;
    }
    onChange?.(day ?? undefined);
  };

  const disabled = useMemo<Matcher | Matcher[] | undefined>(() => {
    const list: Matcher[] = [];

    // Если явно задана minDate — используем её. Иначе используем опцию disabledBeforeToday.
    if (minDate) {
      list.push({
        before: new Date(
          minDate.getFullYear(),
          minDate.getMonth(),
          minDate.getDate()
        ),
      });
    } else if (disabledBeforeToday) {
      const today = new Date();
      list.push({
        before: new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate()
        ),
      });
    }

    // Ограничение максимальной даты: если maxDate не задан, по умолчанию +2 месяца от сегодня
    const todayForMax = new Date();
    const defaultMaxDate = new Date(
      todayForMax.getFullYear(),
      todayForMax.getMonth() + 2,
      todayForMax.getDate()
    );
    const effectiveMaxDate = maxDate ?? defaultMaxDate;
    if (effectiveMaxDate) {
      list.push({
        after: new Date(
          effectiveMaxDate.getFullYear(),
          effectiveMaxDate.getMonth(),
          effectiveMaxDate.getDate()
        ),
      });
    }

    if (disableWeekends) {
      list.push((date: Date) => {
        const day = date.getDay();
        return day === 0 || day === 6; // воскресенье (0) или суббота (6)
      });
    }

    if (list.length === 0) return undefined;
    if (list.length === 1) return list[0];
    return list;
  }, [minDate, maxDate, disableWeekends, disabledBeforeToday]);

  // Мемоизируем локаль с переопределением первого дня недели
  const locale = useMemo(() => {
    return {
      ...enUS,
      options: { ...(enUS.options || {}), weekStartsOn },
    } as typeof enUS;
  }, [weekStartsOn]);

  return (
    <div className={`${styles.wrap} ${className ?? ""}`.trim()}>
      <DayPicker
        mode="single"
        navLayout="around"
        selected={value}
        onSelect={onSelect}
        disabled={disabled}
        locale={locale}
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
