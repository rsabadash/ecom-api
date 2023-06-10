import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  DropdownListItem,
  DropdownMetaValue,
} from '../interfaces/dropdown-list.interface';

export class DropdownListDto implements Omit<DropdownListItem, 'meta'> {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Identifier of dropdown item',
  })
  readonly id: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Value of dropdown item',
  })
  readonly value: string;

  @ValidateNested()
  @ApiPropertyOptional({
    type: 'object',
    additionalProperties: {
      anyOf: [{ type: 'string' }, { type: 'number' }, { type: 'boolean' }],
    },
    description: 'Any additional data related to the dropdown item',
    default: null,
  })
  readonly meta: Map<string, DropdownMetaValue> = null;
}
