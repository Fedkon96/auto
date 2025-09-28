import axios from "axios";
import type { CarDetails, CarsResponse } from "@/types/models";

const api = axios.create({ baseURL: "https://car-rental-api.goit.global" });

export async function fetchCarsBrands(): Promise<string[]> {
  const res = await api.get<string[]>("/brands");
  return res.data;
}

export async function getCars(
  params?: Record<string, string | number | undefined>
): Promise<CarsResponse> {
  const res = await api.get<CarsResponse>("/cars", { params });
  return res.data;
}

export async function getCarById(id: string): Promise<CarDetails> {
  const res = await api.get<CarDetails>(`/cars/${id}`);
  return res.data as CarDetails;
}
