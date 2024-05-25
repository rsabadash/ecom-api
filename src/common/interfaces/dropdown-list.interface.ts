export interface DropdownListQuery {
  _id?: string;
}

export type DropdownMetaValue = string | number | boolean | null;

export interface DropdownMeta {
  [key: string]: DropdownMetaValue;
}

export interface DropdownListItem {
  id: string;
  value: string;
  meta?: DropdownMeta | null;
}
