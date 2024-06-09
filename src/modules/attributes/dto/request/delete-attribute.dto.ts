import { IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DeleteAttribute } from '../../interfaces/attribute.interface';
import { DESCRIPTION } from '../../constants/swagger.constants';

export class DeleteAttributeDto implements DeleteAttribute {
  @IsMongoId()
  @ApiProperty(DESCRIPTION.ATTRIBUTE_ID)
  readonly id: string;
}
