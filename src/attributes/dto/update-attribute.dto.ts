import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';
import { AttributeDto } from './attribute.dto';
import { IAttributeUpdate } from '../interfaces/attribute.interfaces';

export class UpdateAttributeDto
  extends PartialType(OmitType(AttributeDto, ['_id', 'variants'] as const))
  implements IAttributeUpdate
{
  @IsMongoId()
  @ApiProperty({
    description: 'Attribute identifier',
  })
  readonly id: string;
}
