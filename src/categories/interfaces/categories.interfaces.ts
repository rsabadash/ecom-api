import { ObjectId } from 'mongodb';
import { Translations } from '../../common/types/i18n.types';

export interface ICategory {
  _id: ObjectId;
  name: Translations;
  seoName: string;
  isActive: boolean;
  parentIds: ObjectId[];
}

export interface ICategoryDetail extends Omit<ICategory, 'parentIds'> {
  parents: ICategory[];
}

export interface ICreateCategory extends Omit<ICategory, '_id' | 'parentIds'> {
  parentIds: string[];
}

export interface IUpdateCategory extends Partial<ICreateCategory> {
  id: string;
}

export interface IDeleteCategory {
  id: string;
}
