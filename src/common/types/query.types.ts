export type QueryWithPagination<Q extends Record<string, any> = {}> = Q &  {
    page?: string;
    limit?: string;
};

export type QueryWithPaginationParsed<Q extends Record<string, any> = {}> = Q &  {
    page: number;
    limit: number;
};
