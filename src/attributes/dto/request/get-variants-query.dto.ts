import { GetVariantsQuery } from '../../interfaces/query.interface';
import { PaginationParsedQueryDto } from '../../../common/dto/request/pagination-parsed-query.dto';

export class GetVariantsQueryDto
  extends PaginationParsedQueryDto
  implements GetVariantsQuery {}
