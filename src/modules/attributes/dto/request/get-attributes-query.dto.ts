import { GetAttributesQuery } from '../../interfaces/query.interface';
import { PaginationParsedQueryDto } from '../../../../common/dto/request/pagination-parsed-query.dto';

export class GetAttributesQueryDto
  extends PaginationParsedQueryDto
  implements GetAttributesQuery {}
