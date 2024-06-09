import { GetSuppliesQuery } from '../../interfaces/query.interface';
import { PaginationParsedQueryDto } from '../../../../common/dto/request/pagination-parsed-query.dto';

export class GetSuppliesQueryDto
  extends PaginationParsedQueryDto
  implements GetSuppliesQuery {}
