import { GetProductsQuery } from '../../interfaces/query.interface';
import { PaginationParsedQueryDto } from '../../../../common/dto/request/pagination-parsed-query.dto';

export class GetProductsQueryDto
  extends PaginationParsedQueryDto
  implements GetProductsQuery {}
