import { IsMongoId, IsNotEmptyObject, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IProductVariant } from '../interfaces/products.interfaces';
import { TranslationsDto } from '../../common/dto/translations.dto';
import { Translations } from '../../common/types/i18n.types';

export class VariantProductDto implements IProductVariant {
  @IsMongoId()
  @ApiProperty({
    description: 'Identifier of variant for product',
  })
  readonly variantId: string;

  @ValidateNested()
  @IsNotEmptyObject()
  @Type(() => TranslationsDto)
  @ApiProperty({
    type: TranslationsDto,
    description: 'Product variant translations',
  })
  readonly name: Translations;
}
