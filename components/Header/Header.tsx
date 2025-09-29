"use client";

import css from "./Header.module.css";
import Link from "next/link";

import Image from "next/image";
import Container from "../Container/Container";
import { usePathname } from "next/navigation";

const Header = () => {
  const pathname = usePathname();
  const isHomeActive = pathname === "/";
  const isCatalogActive = pathname === "/catalog";
  return (
    <header className={css.header}>
      <Container>
        <div className={css.wrapperNav}>
          <Link href="/" aria-label="Home">
            <Image
              src="/logoRentalCar.svg"
              width={101}
              height={16}
              alt="Rental Car Logo"
            />
          </Link>
          <nav aria-label="Main Navigation">
            <ul className={css.navigationList}>
              <li>
                <Link
                  href="/"
                  className={`${css.link} ${isHomeActive ? css.active : ""}`}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/catalog"
                  className={`${css.link} ${isCatalogActive ? css.active : ""}`}
                >
                  Catalog
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </Container>
    </header>
  );
};

export default Header;
