import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  DropdownListItem,
  DropdownMetaValue,
} from '../../interfaces/dropdown-list.interface';

export class DropdownListDto implements DropdownListItem {
  @ApiProperty({ description: 'Identifier of the dropdown item' })
  readonly id: string;

  @ApiProperty({ description: 'Value of the dropdown item' })
  readonly value: string;

  @ApiPropertyOptional({
    type: 'object',
    additionalProperties: {
      anyOf: [{ type: 'string' }, { type: 'number' }, { type: 'boolean' }],
    },
    description: 'Additional data related to the dropdown item',
    default: null,
  })
  readonly meta: null | Record<string, DropdownMetaValue> = null;
}
