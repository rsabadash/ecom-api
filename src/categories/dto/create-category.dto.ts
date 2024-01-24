import { ApiProperty, OmitType } from '@nestjs/swagger';
import { CategoryDto } from './category.dto';
import { ICategoryCreate } from '../interfaces/categories.interfaces';
import { IsMongoId, IsOptional } from "class-validator";

export class CreateCategoryDto
  extends OmitType(CategoryDto, ['_id', 'childrenIds', 'parentIdsHierarchy'] as const)
  implements ICategoryCreate {
    @IsOptional()
    @IsMongoId()
    @ApiProperty({
        description: 'Parent category identifier for the category',
        nullable: true,
        default: null,
    })
    readonly parentId: string | null = null;
}
