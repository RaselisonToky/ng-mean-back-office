export interface Brand {
  id: string;
  name: string;
}

export interface Model {
  id: string;
  brandId: string;
  name: string;
  releaseYear: number;
}

export const brands: Brand[] = [
  { id: 'brand1', name: 'Toyota' },
  { id: 'brand2', name: 'Honda' },
  { id: 'brand3', name: 'Ford' }
];

export const models: Model[] = [
  { id: 'model1', brandId: 'brand1', name: 'Corolla', releaseYear: 2020 },
  { id: 'model2', brandId: 'brand1', name: 'Camry', releaseYear: 2022 },
  { id: 'model3', brandId: 'brand2', name: 'Civic', releaseYear: 2021 },
  { id: 'model4', brandId: 'brand3', name: 'Mustang', releaseYear: 2023 }
];

export interface UserVehicleFormData {
  name: string;
  email: string;
  phone: string;
  brandId: string;
  modelId: string;
  licensePlate: string;
  appointmentDate: string;
  appointmentTime: string;
}

export interface Service {
  id: string;
  name: string;
  price: number;
  estimateDuration: number;
  categoryId: string;
}
