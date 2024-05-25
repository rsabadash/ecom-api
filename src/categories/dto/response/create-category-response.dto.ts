import { CreateCategoryResponse } from '../../interfaces/response.interface';
import { GetCategoryResponseDto } from './get-category-response.dto';

export class CreateCategoryResponseDto
  extends GetCategoryResponseDto
  implements CreateCategoryResponse {}
