import { IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteWarehouseDto {
  @IsMongoId()
  @ApiProperty({
    description: 'Identifier of the warehouse',
  })
  readonly id: string;
}
