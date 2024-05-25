export type PaginationQuery<Q extends Record<string, any> = any> = Q & {
  page?: string;
  limit?: string;
};

export type PaginationParsedQuery<Q extends Record<string, any> = any> = Q & {
  page?: number;
  limit?: number;
};
