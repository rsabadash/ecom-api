import { ObjectId } from 'mongodb';
import { Translatable } from '../../common/types/i18n.types';

export interface ComicsProduct<T = undefined> {
  _id?: ObjectId | string;
  title: Translatable<T>;
  screenwriter: null | Translatable<T>[];
  artist: null | Translatable<T>[];
  publishingHouse: string;
  language: Translatable<T>;
  format: string;
  cover: Translatable<T>;
  pages: number;
  isbn: string;
  year: number;
  description: Translatable<T>;
  condition: Translatable<T>;
  quantity: number;
  preorder: boolean;
  label: string;
  character: null | Translatable<T>[];
  genre: Translatable<T>[];
  price: number;
  discountPrice: null | number;
  category: 'comics';
}

export type ProductEntity = ComicsProduct<true>;

export type ProductEntityTranslated = ComicsProduct;
