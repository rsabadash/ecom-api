export interface PaginationMetaData {
  total: number;
}

export interface PaginationData<D> {
  data: D[];
  metadata: PaginationMetaData;
}
