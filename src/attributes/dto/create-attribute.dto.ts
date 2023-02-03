import { OmitType } from '@nestjs/swagger';
import { AttributeDto } from './attribute.dto';

export class CreateAttributeDto extends OmitType(AttributeDto, [
  '_id',
] as const) {}
