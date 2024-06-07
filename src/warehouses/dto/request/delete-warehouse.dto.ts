import { IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DeleteWarehouse } from '../../interface/warehouse.interface';
import { DESCRIPTION } from '../../constants/swagger.constants';

export class DeleteWarehouseDto implements DeleteWarehouse {
  @IsMongoId()
  @ApiProperty(DESCRIPTION.ID)
  readonly id: string;
}
