import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { CreateProductVariant } from '../../interfaces/products.interfaces';

export class CreateProductVariantDto implements CreateProductVariant {
  @IsMongoId()
  readonly variantId: string;

  @IsString()
  @IsNotEmpty()
  readonly name: string;
}
