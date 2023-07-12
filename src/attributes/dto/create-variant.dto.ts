import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';
import { VariantDto } from './variant.dto';
import { IVariantCreate } from '../interfaces/variant.interfaces';

export class CreateVariantDto
  extends OmitType(VariantDto, ['variantId'] as const)
  implements IVariantCreate
{
  @IsMongoId()
  @ApiProperty({
    description: 'Parent attribute identifier',
  })
  readonly attributeId: string;
}
