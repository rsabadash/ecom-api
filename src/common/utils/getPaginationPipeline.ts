import { Pipeline } from '../../mongo/types/colection-model.types';
import { PartialEntity } from '../../mongo/types/mongo-query.types';
import {
  DEFAULT_LIMIT_PAGINATION,
  DEFAULT_SKIP_PAGINATION,
} from '../constants/pagination.constants';

interface GetPaginationPipelineFilter {
  skip?: number;
  limit?: number;
}

interface GetPaginationPipelineArgs<E> {
  query: PartialEntity<E>;
  filter: GetPaginationPipelineFilter;
}

export const getPaginationPipeline = <E>({
  query,
  filter,
}: GetPaginationPipelineArgs<E>): Pipeline => {
  const { skip = DEFAULT_SKIP_PAGINATION, limit = DEFAULT_LIMIT_PAGINATION } =
    filter;

  return [
    { $match: query },
    {
      $facet: {
        data: [
          {
            $skip: skip,
          },
          {
            $limit: limit,
          },
        ],
        total: [{ $count: 'count' }],
      },
    },
    {
      $project: {
        data: 1,
        metadata: { total: { $arrayElemAt: ['$total.count', 0] } },
      },
    },
  ];
};
