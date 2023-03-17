import {
  IsDate,
  IsMongoId,
  IsNotEmptyObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { TranslationsDto } from '../../common/dto/translations.dto';
import { Translations } from '../../common/types/i18n.types';
import {
  IWarehouseProductAttribute,
  IWarehouseProductVariant,
} from '../interfaces/warehouse-products.interfaces';
import { ObjectId } from 'mongodb';

class VariantWarehouseProductDto {
  @IsMongoId()
  @ApiProperty({
    description: 'Identifier of the variant for the warehouse product',
  })
  readonly variantId: string;

  @ValidateNested()
  @Type(() => TranslationsDto)
  @ApiProperty({
    type: TranslationsDto,
    description: 'Translation object for the warehouse product variant',
  })
  readonly name: Translations;
}

export class AttributeWarehouseProductDto {
  @IsMongoId()
  @ApiProperty({
    description: 'Identifier of the attribute for the warehouse product',
  })
  readonly attributeId: string;

  @ValidateNested()
  @Type(() => TranslationsDto)
  @ApiProperty({
    type: TranslationsDto,
    description: 'Translation object for the warehouse product attribute',
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

export class WarehouseProductDto {
  @IsMongoId()
  @ApiProperty({
    type: 'string',
    description: 'Identifier of the warehouse product',
  })
  readonly _id: ObjectId;

  @ValidateNested()
  @IsNotEmptyObject()
  @Type(() => TranslationsDto)
  @ApiProperty({
    type: TranslationsDto,
    description: 'Translation object for the warehouse product name',
  })
  readonly name: Translations;

  @IsString()
  @ApiProperty({
    description: 'A unique SKU identifier of the warehouse product',
  })
  readonly sku: string;

  @ValidateNested({ each: true })
  @Type(() => AttributeWarehouseProductDto)
  @ApiProperty({
    type: [AttributeWarehouseProductDto],
    description: 'Attributes for the warehouse product',
    nullable: true,
    default: null,
  })
  readonly attributes: null | IWarehouseProductAttribute[] = null;

  @IsMongoId()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Identifier of the warehouse product group',
    nullable: true,
    default: null,
  })
  readonly groupId: null | string = null;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Name of the warehouse product group',
    nullable: true,
    default: null,
  })
  readonly groupName: null | string = null;

  @IsDate()
  @ApiProperty({
    description: 'Date of the warehouse product creation',
  })
  createdDate: Date;
}
