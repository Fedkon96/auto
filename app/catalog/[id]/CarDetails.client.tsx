"use client";

import React, { useEffect, useRef, useState } from "react";
import type { CarDetails } from "@/types/models";
import { shortAddress } from "@/lib/format";
import Image from "next/image";
import styles from "./CarDetails.module.css";
import Icon from "@/components/Icon/Icon";
import formatNumberWithComma from "@/lib/format";
import Section from "@/components/Section/Section";
import Container from "@/components/Container/Container";
import Calendar from "@/components/Calendar/Calendar";

type Props = {
  car: CarDetails;
};

export default function CarDetailsClient({ car }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [bookingDateText, setBookingDateText] = useState("");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const datePickerRef = useRef<HTMLDivElement | null>(null);

  const formatDate = (date: Date) =>
    date.toLocaleDateString("uk-UA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

  useEffect(() => {
    if (!isCalendarOpen) return;
    const onDocMouseDown = (e: MouseEvent) => {
      const root = datePickerRef.current;
      if (!root) return;
      if (e.target instanceof Node && !root.contains(e.target)) {
        setIsCalendarOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsCalendarOpen(false);
    };
    document.addEventListener("mousedown", onDocMouseDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onDocMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isCalendarOpen]);

  const handleSubmit = (formData: FormData) => {
    formData.get("name");
    formData.get("email");
    formData.get("bookingDate");
    formData.get("comment");
    setSent(true);
    setTimeout(() => setSent(false), 3000);
    setName("");
    setEmail("");
    setMessage("");
    setBookingDateText("");
  };

  return (
    <Section>
      <Container>
        <div className={styles.details}>
          <div className={styles.leftCol}>
            <div className={styles.media}>
              <Image
                src={car.img}
                alt={`${car.brand} ${car.model}`}
                width={600}
                height={360}
                className={styles.img}
              />
            </div>

            <form
              className={styles.formCard}
              action={handleSubmit}
              aria-label="booking form"
            >
              <div className={styles.formHeader}>Book your car now</div>
              <div className={styles.formSub}>
                Stay connected! We are always ready to help you.
              </div>
              <ul className={styles.columnInput} role="list">
                <li>
                  <input
                    name="name"
                    required
                    type="text"
                    placeholder="Name*"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={styles.input}
                  />
                </li>
                <li>
                  <input
                    name="email"
                    required
                    type="email"
                    placeholder="Email*"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={styles.input}
                  />
                </li>
                <li className={styles.dateItem}>
                  <div className={styles.datePicker} ref={datePickerRef}>
                    <input
                      name="bookingDate"
                      type="text"
                      placeholder="Booking date"
                      className={`${styles.input} ${styles.inputWithIcon}`}
                      value={bookingDateText}
                      onChange={(e) => setBookingDateText(e.target.value)}
                      onFocus={() => setIsCalendarOpen(true)}
                      onClick={() => setIsCalendarOpen(true)}
                    />
                    <button
                      type="button"
                      className={styles.dateIconBtn}
                      aria-label="Calendar"
                      onClick={() => setIsCalendarOpen((v) => !v)}
                    >
                      <Icon id="icon-calendar" />
                    </button>
                    {isCalendarOpen ? (
                      <div
                        className={styles.calendarPopup}
                        role="dialog"
                        aria-label="Choose date"
                      >
                        <Calendar
                          value={selectedDate}
                          onChange={(date) => {
                            setSelectedDate(date ?? undefined);
                            if (date) {
                              const txt = formatDate(date);
                              setBookingDateText(txt);
                              setIsCalendarOpen(false);
                            }
                          }}
                          disabledBeforeToday
                        />
                      </div>
                    ) : null}
                  </div>
                </li>
              </ul>

              <textarea
                name="comment"
                placeholder="Comment"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className={styles.textarea}
                rows={4}
              />
              <button type="submit" className={styles.button}>
                Send
              </button>
              {sent ? (
                <div className={styles.notice}>
                  Thanks! We&#39;ll contact you shortly.
                </div>
              ) : null}
            </form>
          </div>

          <div className={styles.rightCol}>
            <div className={styles.titleRow}>
              <h1 className={styles.title}>
                <ul className={styles.titleList} role="list">
                  <li className={styles.brand}>{car.brand}</li>
                  <li className={styles.model}>{`${car.model},`}</li>
                  <li className={styles.year}>{car.year}</li>
                </ul>
              </h1>
              <span className={styles.id}>Id: {car.id}</span>
            </div>

            <ul className={styles.specs} role="list">
              <li className={styles.specItem}>
                <Icon id="icon-location" /> {shortAddress(car.address)}
              </li>
              <li className={styles.specItem}>
                <span className={styles.specSep} aria-hidden="true" />
                Mileage: {formatNumberWithComma(car.mileage)} km
              </li>
            </ul>

            <div className={styles.price}>{`$${car.rentalPrice}`}</div>

            {car.description ? (
              <p className={styles.desc}>{car.description}</p>
            ) : null}

            {car.rentalConditions?.length ? (
              <div className={styles.block}>
                <div className={styles.blockTitle}>Rental Conditions:</div>
                <ul className={styles.bulletList}>
                  {car.rentalConditions.map((rc) => (
                    <li key={rc}>
                      <Icon id="icon-check-circle" /> {rc}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className={styles.block}>
              <div className={styles.blockTitle}>Car Specifications:</div>
              <ul className={styles.bulletList}>
                <li>
                  <Icon id="icon-calendar" /> Year: {car.year}
                </li>
                <li>
                  <Icon id="icon-gear" /> Type: {car.type}
                </li>
                {car.fuelConsumption ? (
                  <li>
                    <Icon id="icon-fuel-pump" /> Fuel Consumption:{" "}
                    {car.fuelConsumption}
                  </li>
                ) : null}
                {car.engineSize ? (
                  <li>
                    <Icon id="icon-gear" /> Engine Size: {car.engineSize}
                  </li>
                ) : null}
              </ul>
            </div>

            {car.accessories?.length || car.functionalities?.length ? (
              <div className={styles.block}>
                <div className={styles.blockTitle}>
                  Accessories and functionalities:
                </div>
                <ul className={styles.bulletList}>
                  {[
                    ...(car.accessories || []),
                    ...(car.functionalities || []),
                  ].map((item) => (
                    <li key={item}>
                      <Icon id="icon-check-circle" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      </Container>
    </Section>
  );
}
