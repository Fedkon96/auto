import css from "./Header.module.css";
import Link from "next/link";
// import AuthNavigation from "../AuthNavigation/AuthNavigation";
import Image from "next/image";
import Container from "../Container/Container";

const Header = () => {
  return (
    <header className={css.header}>
      <Container>
        <div className={css.wrapperNav}>
          <Link href="/" className={css.active} aria-label="Home">
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
                <Link href="/" className={css.link}>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/catalog" className={css.link}>
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
