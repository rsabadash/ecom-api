import { IsMongoId, IsNotEmptyObject, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IProductAttribute,
  IProductVariant,
} from '../interfaces/products.interfaces';
import { TranslationsDto } from '../../common/dto/translations.dto';
import { Translations } from '../../common/types/i18n.types';
import { VariantProductDto } from './variant-product.dto';

export class AttributeProductDto
  implements IProductAttribute
{
  @IsMongoId()
  @ApiProperty({
    description: 'Identifier of attribute related to product',
  })
  readonly attributeId: string;

  @ValidateNested()
  @IsNotEmptyObject()
  @Type(() => TranslationsDto)
  @ApiProperty({
    type: TranslationsDto,
    description: 'Product attribute translations',
  })
  readonly name: Translations;

  @ValidateNested({ each: true })
  @Type(() => VariantProductDto)
  @ApiProperty({
    type: [VariantProductDto],
    description: 'Variants for product',
  })
  readonly variants: IProductVariant[];
}
