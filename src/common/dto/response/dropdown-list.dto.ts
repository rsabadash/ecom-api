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
    example: {
      someProperty1: 123,
      someProperty2: 'test',
      someProperty3: true,
      someProperty4: null,
    },
    description: 'Additional data related to the dropdown item',
  })
  readonly meta: Record<string, DropdownMetaValue> | null = null;
}
