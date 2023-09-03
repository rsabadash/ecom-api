import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';
import { SupplierDto } from './supplier.dto';
import { ISupplierUpdate } from '../interfaces/suppliers.interfaces';

export class UpdateSupplierDto
  extends PartialType(OmitType(SupplierDto, ['_id'] as const))
  implements ISupplierUpdate
{
  @IsMongoId()
  @ApiProperty({
    description: 'Supplier identifier',
  })
  readonly id: string;
}
