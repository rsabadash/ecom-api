import { VariantDto } from './variant.dto';
import { IVariantWithAttributeDto } from '../interfaces/variant-with-attribute.interfaces';
import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VariantWithAttributeDto
  extends VariantDto
  implements IVariantWithAttributeDto
{
  @IsMongoId()
  @ApiProperty({
    description: 'Attribute identifier (returned as ObjectId)',
  })
  readonly attributeId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Attribute name',
  })
  readonly attributeName: string;
}
