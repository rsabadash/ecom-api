export interface DropdownListQuery {
  _id?: string;
}

export type DropdownMetaValue = string | number | boolean | null;

export type DropdownMeta<M> = M & {
  [key: string]: DropdownMetaValue;
};

export interface DropdownListItem<M = Record<string, DropdownMetaValue>> {
  id: string;
  value: string;
  meta?: DropdownMeta<M> | null;
}
