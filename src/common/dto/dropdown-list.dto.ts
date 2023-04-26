import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DropdownListItem } from '../interfaces/dropdown-list.interface';

export class DropdownListDto implements DropdownListItem {
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
}
