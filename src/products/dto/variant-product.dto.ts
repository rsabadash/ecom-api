import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IProductVariant } from '../interfaces/products.interfaces';

export class VariantProductDto implements IProductVariant {
  @IsMongoId()
  @ApiProperty({
    description: 'Identifier of variant for product',
  })
  readonly variantId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Product variant name',
  })
  readonly name: string;
}
