import { ObjectId } from 'mongodb';

export interface DropdownListItem {
  id: string | ObjectId;
  value: string;
}
