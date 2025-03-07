export interface Service {
  name: string;
  category: Category;
  price: number;
  estimateDuration: number;
}

export interface Category {
  name: string;
  backgroundColor?: string;
  borderColor?:string;
  color?: string;
}
