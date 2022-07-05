import { Language } from '../../common/types/i18n.types';
import { ProductEntity } from '../interfaces/product.interface';

export type GetProductsOpts = {
  language: Language;
};

export type GetProductOpts = {
  productId: string;
};

export type PatchProductOpts = {
  language: Language;
  data: ProductEntity;
};

export type ProductKeys = Array<keyof ProductEntity>;
