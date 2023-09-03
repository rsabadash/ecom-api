import { OmitType } from '@nestjs/swagger';
import { AttributeDto } from './attribute.dto';
import { IAttributeCreate } from '../interfaces/attribute.interfaces';

export class CreateAttributeDto
  extends OmitType(AttributeDto, ['_id'] as const)
  implements IAttributeCreate {}
