export type CarSummary = {
  id: string;
  year: number;
  brand: string;
  model: string;
  type: string;
  img: string;
  rentalPrice: string;
  mileage: number;
  rentalCompany: string;
  address: string;
};

export type CarDetails = CarSummary & {
  description?: string;
  fuelConsumption?: string;
  engineSize?: string;
  accessories?: string[];
  functionalities?: string[];
  rentalConditions?: string[];
};

export type CarsResponse = {
  cars: CarSummary[];
  totalCars: number;
  page: number;
  totalPages: number;
};

export type CarFilters = {
  brand?: string;
  rentalPrice?: number;
  minMileage?: number;
  maxMileage?: number;
};
