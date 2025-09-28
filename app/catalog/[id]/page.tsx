import { getCarById } from "@/lib/api";
import CarDetailsClient from "./CarDetails.client";
import styles from "./CarDetails.module.css";

type Props = { params: { id: string } };

export default async function CarDetailsPage({ params }: Props) {
  const car = await getCarById(params.id);
  return (
    <div className={styles.wrap}>
      <CarDetailsClient car={car} />
    </div>
  );
}
