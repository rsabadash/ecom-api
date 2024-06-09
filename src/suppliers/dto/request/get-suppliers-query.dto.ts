import { GetSuppliersQuery } from '../../interfaces/query.interface';
import { PaginationParsedQueryDto } from '../../../common/dto/request/pagination-parsed-query.dto';

export class GetSuppliersQueryDto
  extends PaginationParsedQueryDto
  implements GetSuppliersQuery {}
