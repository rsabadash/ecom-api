import {
  IsDate,
  IsMongoId,
  IsNotEmptyObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ObjectId } from 'mongodb';
import { Type } from 'class-transformer';
import { TranslationsDto } from '../../common/dto/translations.dto';
import { Translations } from '../../common/types/i18n.types';
import {
  IWarehouseProduct,
  IWarehouseProductAttribute,
  IWarehouseProductVariant,
} from '../interfaces/warehouse-products.interfaces';

class VariantWarehouseProductDto implements IWarehouseProductVariant {
  @IsMongoId()
  @ApiProperty({
    description: 'Identifier of the variant for the warehouses product',
  })
  readonly variantId: string;

  @ValidateNested()
  @Type(() => TranslationsDto)
  @ApiProperty({
    type: TranslationsDto,
    description: 'Translation object for the warehouses product variant',
  })
  readonly name: Translations;
}

export class AttributeWarehouseProductDto
  implements IWarehouseProductAttribute
{
  @IsMongoId()
  @ApiProperty({
    description: 'Identifier of the attribute for the warehouses product',
  })
  readonly attributeId: string;

  @ValidateNested()
  @Type(() => TranslationsDto)
  @ApiProperty({
    type: TranslationsDto,
    description: 'Translation object for the warehouses product attribute',
  })
  readonly name: Translations;

  @ValidateNested({ each: true })
  @Type(() => VariantWarehouseProductDto)
  @ApiProperty({
    type: [VariantWarehouseProductDto],
    description: 'Variants for the warehouses product',
  })
  readonly variants: IWarehouseProductVariant[];
}

export class WarehouseProductDto implements IWarehouseProduct {
  @IsMongoId()
  @ApiProperty({
    type: 'string',
    description: 'Identifier of the warehouses product',
  })
  readonly _id: ObjectId;

  @ValidateNested()
  @IsNotEmptyObject()
  @Type(() => TranslationsDto)
  @ApiProperty({
    type: TranslationsDto,
    description: 'Translation object for the warehouses product name',
  })
  readonly name: Translations;

  @IsString()
  @ApiProperty({
    description: 'A unique SKU identifier of the warehouses product',
  })
  readonly sku: string;

  @ValidateNested({ each: true })
  @Type(() => AttributeWarehouseProductDto)
  @ApiProperty({
    type: [AttributeWarehouseProductDto],
    description: 'Attributes for the warehouses product',
    nullable: true,
    default: null,
  })
  readonly attributes: null | IWarehouseProductAttribute[] = null;

  @IsMongoId()
  @IsOptional()
  @ApiPropertyOptional({
    type: 'string',
    description: 'Identifier of the warehouses product group',
    nullable: true,
    default: null,
  })
  readonly groupId: null | ObjectId = null;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Name of the warehouses product group',
    nullable: true,
    default: null,
  })
  readonly groupName: null | string = null;

  @IsDate()
  @ApiProperty({
    description: 'Date of the warehouses product creation',
  })
  createdDate: Date;
}
