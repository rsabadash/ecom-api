import { VariantDto } from './variant.dto';
import { IVariantWithAttribute } from '../interfaces/variant-with-attribute.interfaces';
import { IsMongoId, IsNotEmptyObject, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { TranslationsDto } from '../../common/dto/translations.dto';
import { Translations } from '../../common/types/i18n.types';

export class VariantWithAttributeDto
  extends VariantDto
  implements Omit<IVariantWithAttribute, 'attributeId'>
{
  @IsMongoId()
  @ApiProperty({
    description: 'Attribute identifier (returned as ObjectId)',
  })
  readonly attributeId: string;

  @ValidateNested()
  @IsNotEmptyObject()
  @Type(() => TranslationsDto)
  @ApiProperty({
    type: TranslationsDto,
    description: 'Attribute name translations',
  })
  readonly attributeName: Translations;
}
