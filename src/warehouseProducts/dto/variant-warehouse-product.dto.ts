import { IsMongoId, IsNotEmptyObject, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IWarehouseProductVariant } from '../interfaces/warehouse-products.interfaces';
import { TranslationsDto } from '../../common/dto/translations.dto';
import { Translations } from '../../common/types/i18n.types';

export class VariantWarehouseProductDto implements IWarehouseProductVariant {
  @IsMongoId()
  @ApiProperty({
    description: 'Identifier of variant for warehouse product',
  })
  readonly variantId: string;

  @ValidateNested()
  @IsNotEmptyObject()
  @Type(() => TranslationsDto)
  @ApiProperty({
    type: TranslationsDto,
    description: 'Warehouse product variant translations',
  })
  readonly name: Translations;
}
