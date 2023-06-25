import { IsMongoId, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ProductsToCreateSupply } from '../interfaces/supplies.interfaces';

export class ProductsToCreateSupplyDto implements ProductsToCreateSupply {
  // TODO validation
  @IsString()
  @ApiProperty({
    description: 'Quantity of the product in the supply',
  })
  readonly quantity: string;

  // TODO validation
  @IsString()
  @ApiProperty({
    description: 'Price of the product in the supply',
  })
  readonly price: string;

  // TODO validation
  @IsString()
  @ApiProperty({
    description: 'Total cost of the product in the supply',
  })
  readonly totalCost: string;

  @IsMongoId()
  @ApiProperty({
    description: 'Identifier of the product',
  })
  readonly productId: string;
}
