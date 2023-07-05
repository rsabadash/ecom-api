import { ArrayNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, PickType } from '@nestjs/swagger';
import {
  ISupplyCreate,
  ISupplyProductToCreate,
} from '../interfaces/supplies.interfaces';
import { SupplyProductToCreateDto } from './supply-product-to-create.dto';
import { SupplyDto } from './supply.dto';

export class CreateSupplyDto
  extends PickType(SupplyDto, [
    'name',
    'productsTotalCost',
    'supplierId',
    'warehouseId',
  ])
  implements ISupplyCreate
{
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => SupplyProductToCreateDto)
  @ApiProperty({
    type: [SupplyProductToCreateDto],
    description: 'List of products in supply',
  })
  readonly products: ISupplyProductToCreate[];
}
