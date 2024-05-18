import {
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { VariantDto } from './variant.dto';
import { IVariant } from '../interfaces/variant.interfaces';
import { URL_SLUG } from '../../common/constants/reg-exp.contants';
import { IAttributeDto } from '../interfaces/attribute.interfaces';

export class AttributeDto implements IAttributeDto {
  @IsMongoId()
  @ApiProperty({
    description: 'Attribute identifier (returned as ObjectId)',
  })
  readonly _id: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Attribute name',
  })
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  @Matches(RegExp(URL_SLUG), {
    message: 'SEO attribute name should contains only number and Latin letters',
  })
  @ApiProperty({
    description: 'Attribute name that is used for search engine optimization',
  })
  readonly seoName: string;

  @IsBoolean()
  @ApiProperty({
    description: 'Is attribute visible for public users',
  })
  readonly isActive: boolean;

  @ValidateNested({ each: true })
  @Type(() => VariantDto)
  @ApiProperty({
    description: 'Attribute variants',
    nullable: true,
    default: [],
  })
  readonly variants: IVariant[] = [];
}
