import { IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IAttributeDelete } from '../interfaces/attribute.interfaces';

export class DeleteAttributeDto implements IAttributeDelete {
  @IsMongoId()
  @ApiProperty({
    description: 'Attribute identifier',
  })
  readonly id: string;
}
