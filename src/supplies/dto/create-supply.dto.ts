import {
  ArrayNotEmpty,
  IsMongoId,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
  ISupply,
  ProductsToCreateSupply,
} from '../interfaces/supplies.interfaces';
import { ProductsToCreateSupplyDto } from './products-to-create-supply.dto';

export class CreateSupplyDto
  implements
    Pick<
      ISupply,
      | 'name'
      | 'productsTotalCost'
      | 'productsTotalQuantity'
      | 'supplierId'
      | 'warehouseId'
    >
{
  @IsString()
  @ApiProperty({
    description: 'Name of supply',
    nullable: true,
    default: null,
  })
  readonly name: null | string = null;

  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ProductsToCreateSupplyDto)
  @ApiProperty({
    type: [ProductsToCreateSupplyDto],
    description: 'List of products in the supply',
  })
  readonly products: ProductsToCreateSupply[];

  // TODO validation
  @IsString()
  @ApiProperty({
    description: 'Total cost of all products in the supply',
  })
  readonly productsTotalCost: string;

  // TODO validation
  @IsString()
  @ApiProperty({
    description: 'Total quantity of products in the supply',
  })
  readonly productsTotalQuantity: string;

  @IsMongoId()
  @ApiProperty({
    description: 'Identifier of the supplier',
  })
  readonly supplierId: string;

  @IsMongoId()
  @ApiProperty({
    description: 'Identifier of the warehouse',
  })
  readonly warehouseId: string;
}
