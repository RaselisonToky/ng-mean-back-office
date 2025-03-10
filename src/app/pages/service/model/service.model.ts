export interface Service {
  id: string;
  name: string;
  price: number;
  estimateDuration: number;
  categoryId: string;
}

export interface Category {
  id: string;
  name: string;
  backgroundColor: string;
  color: string;
  borderColor: string;
}
