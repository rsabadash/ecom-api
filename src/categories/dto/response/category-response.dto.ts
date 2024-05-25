import { ApiProperty } from '@nestjs/swagger';
import { CategoryEntityResponse } from '../../interfaces/response.interface';

export class CategoryResponseDto implements CategoryEntityResponse {
  @ApiProperty({ description: 'Category identifier' })
  readonly _id: string;

  @ApiProperty({ description: 'Category name' })
  readonly name: string;

  @ApiProperty({ description: 'Search engine optimization category name' })
  readonly seoName: string;

  @ApiProperty({ description: 'Is category visible for public users' })
  readonly isActive: boolean;

  @ApiProperty({
    description: 'Children category identifiers of the category',
    default: [],
  })
  readonly childrenIds: string[];

  @ApiProperty({
    description:
      'Parent category identifiers of the category in hierarchy order (index 0 - highest parent, last index - lowest parent)',
    default: [],
  })
  readonly parentIdsHierarchy: string[];
}
