import { ObjectId } from 'mongodb';
import { ICategory } from '../interfaces/categories.interfaces';

export type GetCategoryParameters = {
  categoryId: ObjectId;
};

export type CategoryKeys = Array<keyof ICategory>;
