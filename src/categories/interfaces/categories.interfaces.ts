import { ObjectId } from 'mongodb';
import { Translations } from '../../common/types/i18n.types';

export interface ICategory {
  _id: ObjectId;
  name: Translations;
  seoName: string;
  isActive: boolean;
  parentIds: string[];
}

export interface ICategoryWithFullParents extends Omit<ICategory, 'parentIds'> {
  parents: ICategory[];
}

export interface ICategoryDto extends Omit<ICategory, '_id'> {
  _id: string;
}

export interface ICategoryWithFullParentsDto
  extends Omit<ICategoryWithFullParents, '_id'> {
  _id: string;
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

export interface GetCategoryParameters {
  categoryId: string;
}
