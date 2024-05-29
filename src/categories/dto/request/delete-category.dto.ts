import { IsMongoId } from 'class-validator';
import { DeleteCategory } from '../../interfaces/category.interface';
import { ApiProperty } from '@nestjs/swagger';
import { DESCRIPTION } from '../../constants/swagger.constants';

export class DeleteCategoryDto implements DeleteCategory {
  @IsMongoId()
  @ApiProperty(DESCRIPTION.ID)
  readonly id: string;
}
