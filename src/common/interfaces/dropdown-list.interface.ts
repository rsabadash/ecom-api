import { ObjectId } from 'mongodb';

export interface DropdownListQueryParams {
  _id?: ObjectId;
}

export interface DropdownListItem {
  id: string | ObjectId;
  value: string;
}
