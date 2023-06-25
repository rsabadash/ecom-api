export interface PaginationQuery {
  page?: string;
  limit?: string;
}

export interface PaginationParsedQuery {
  page: number;
  limit: number;
}

export interface PaginationData<D> {
  data: D[];
  metadata: {
    total: number;
  };
}
