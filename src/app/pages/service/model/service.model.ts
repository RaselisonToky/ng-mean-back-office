import {Category} from '../../category/model/category.model';

export interface Service {
  _id: string;
  name: string;
  price: number;
  estimateDuration: number;
  category: Category;
}
