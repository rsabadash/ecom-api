import { IsMongoId, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IWarehouseProductAttribute,
  IWarehouseProductVariant,
} from '../interfaces/warehouse-products.interfaces';
import { TranslationsDto } from '../../common/dto/translations.dto';
import { Translations } from '../../common/types/i18n.types';
import { VariantWarehouseProductDto } from './variant-warehouse-product.dto';

export class AttributeWarehouseProductDto
  implements IWarehouseProductAttribute
{
  @IsMongoId()
  @ApiProperty({
    description: 'Identifier of the attribute for the warehouse product',
  })
  readonly attributeId: string;

  @ValidateNested()
  @Type(() => TranslationsDto)
  @ApiProperty({
    type: TranslationsDto,
    description: 'Warehouse product attribute translations',
  })
  readonly name: Translations;

  @ValidateNested({ each: true })
  @Type(() => VariantWarehouseProductDto)
  @ApiProperty({
    type: [VariantWarehouseProductDto],
    description: 'Variants for the warehouse product',
  })
  readonly variants: IWarehouseProductVariant[];
}
