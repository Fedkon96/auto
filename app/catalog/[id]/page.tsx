import { getCarById } from "@/lib/api";
import CarDetailsClient from "./CarDetails.client";
import styles from "./CarDetails.module.css";

type Props = { params: Promise<{ id: string }> };

export default async function CarDetailsPage({ params }: Props) {
  const { id } = await params;
  const car = await getCarById(id);
  return (
    <div className={styles.wrap}>
      <CarDetailsClient car={car} />
    </div>
  );
}
