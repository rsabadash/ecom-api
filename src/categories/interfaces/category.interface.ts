import { ObjectId } from 'mongodb';

export interface CategoryEntity {
  _id: ObjectId;
  name: string;
  seoName: string;
  isActive: boolean;
  childrenIds: string[];
  parentIdsHierarchy: string[];
}

export interface CreateCategory {
  name: string;
  seoName: string;
  isActive: boolean;
  parentId: string | null;
}

export interface UpdateCategory {
  id: string;
  name?: string;
  seoName?: string;
  isActive?: boolean;
  parentId?: string | null;
}

export interface DeleteCategory {
  id: string;
}
