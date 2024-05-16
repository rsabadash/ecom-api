import { ObjectId } from 'mongodb';

export interface ICategory {
  _id: ObjectId;
  name: string;
  seoName: string;
  isActive: boolean;
  childrenIds: string[];
  parentIdsHierarchy: string[];
}

export interface ICategoryDto extends Omit<ICategory, '_id'> {
  _id: string;
}

export interface ICategoryWithFullParents
  extends Omit<ICategory, 'parentIdsHierarchy'> {
  parents: ICategory[];
}

export interface ICategoryWithFullParentsDto
  extends Omit<ICategoryWithFullParents, '_id'> {
  _id: string;
}

export interface ICategoryCreate
  extends Omit<ICategory, '_id' | 'childrenIds' | 'parentIdsHierarchy'> {
  parentId: string | null;
}

export interface ICategoryUpdate
  extends Partial<
    Omit<ICategory, '_id' | 'childrenIds' | 'parentIdsHierarchy'>
  > {
  id: string;
  parentId: string | null;
}

export interface ICategoryDelete {
  id: string;
}

export interface GetCategoryParameters {
  categoryId: string;
}
