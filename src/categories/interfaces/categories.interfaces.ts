import { ObjectId } from 'mongodb';
import { Translations } from '../../common/types/i18n.types';

export interface ICategory {
  _id: ObjectId;
  name: Translations;
  seoName: string;
  isActive: boolean;
  parentIds: string[];
}

export interface ICategoryCreate extends Omit<ICategory, '_id' | 'parentIds'> {
  parentIds: string[];
}

export interface ICategoryUpdate extends Partial<ICategory> {
  id: string;
}

export interface ICategoryDelete {
  id: string;
}
