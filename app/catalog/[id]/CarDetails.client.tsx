"use client";

import React, { useState } from "react";
import type { CarDetails } from "@/types/models";
import { shortAddress } from "@/lib/format";
import Image from "next/image";
import styles from "./CarDetails.module.css";
import Icon from "@/components/Icon/Icon";
import formatNumberWithComma from "@/lib/format";
import Section from "@/components/Section/Section";
import Container from "@/components/Container/Container";

type Props = {
  car: CarDetails;
};

export default function CarDetailsClient({ car }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3000);
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <Section>
      <Container>
        <div className={styles.details}>
          {/* Left: media + booking */}
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

            <form className={styles.formCard} onSubmit={onSubmit}>
              <div className={styles.formHeader}>Book your car now</div>
              <div className={styles.formSub}>
                Stay connected! We are always ready to help you.
              </div>
              <div className={styles.columnInput}>
                <input
                  required
                  type="text"
                  placeholder="Name*"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={styles.input}
                />
                <input
                  required
                  type="email"
                  placeholder="Email*"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.input}
                />
                <input
                  type="text"
                  placeholder="Booking date"
                  className={styles.input}
                />
              </div>

              <textarea
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

          {/* Right: details */}
          <div className={styles.rightCol}>
            <h1 className={styles.title}>
              <ul className={styles.titleList} role="list">
                <li className={styles.brand}>{car.brand}</li>
                <li className={styles.model}>{car.model}</li>
                <li className={styles.year}>{car.year}</li>
              </ul>
            </h1>

            <ul className={styles.specs} role="list">
              <li className={styles.specItem}>
                <Icon id="icon-location" /> {shortAddress(car.address)}
              </li>
              <li className={styles.specItem}>
                <span className={styles.specSep} aria-hidden="true" />
                Mileage: {formatNumberWithComma(car.mileage)} km
              </li>
            </ul>

            <div className={styles.price}>${car.rentalPrice}</div>

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
