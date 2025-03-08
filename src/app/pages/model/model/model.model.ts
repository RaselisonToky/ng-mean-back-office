import {Brand} from '../../brand/model/brand.model';

export interface Model{
  _id: string;
  name: string;
  brand: Brand;
  releaseYear: number;
}
