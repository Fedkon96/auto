import styles from "./page.module.css";
import Container from "@/components/Container/Container";
import Link from "next/link";

export default function Home() {
  return (
    <div className={styles.hero}>
      <Container>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>Find your perfect rental car</h1>
          <h2 className={styles.description}>
            Reliable and budget-friendly rentals for any journey
          </h2>
          <Link href="/catalog" className={styles.button}>
            View Catalog
          </Link>
        </div>
      </Container>
    </div>
  );
}
