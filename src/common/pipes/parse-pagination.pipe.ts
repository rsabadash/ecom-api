import { PipeTransform, Injectable } from '@nestjs/common';
import {
  PaginationParsedQuery,
  PaginationQuery,
} from '../interfaces/pagination.interface';
import {
  DEFAULT_LIMIT_PAGINATION,
  DEFAULT_SKIP_PAGINATION,
} from '../constants/pagination.constants';

@Injectable()
export class ParsePaginationPipe implements PipeTransform {
  transform(value: PaginationQuery): PaginationParsedQuery {
    let skipValue = DEFAULT_SKIP_PAGINATION;
    let limitValue = DEFAULT_LIMIT_PAGINATION;

    const { page, limit } = value;

    if (limit !== undefined) {
      const numberedLimit = parseInt(limit);

      limitValue = Number.isNaN(numberedLimit)
        ? DEFAULT_LIMIT_PAGINATION
        : numberedLimit;
    }

    if (page !== undefined) {
      const parsedPage = parseInt(page);
      const numberedPage =
        Number.isNaN(parsedPage) || parsedPage === 0 ? 1 : parsedPage;

      skipValue = (numberedPage - 1) * limitValue;
    }

    return {
      page: skipValue,
      limit: limitValue,
    };
  }
}