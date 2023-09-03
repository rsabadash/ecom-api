import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';
import { ISupplierDelete } from '../interfaces/suppliers.interfaces';

export class DeleteSupplierDto implements ISupplierDelete {
  @IsMongoId()
  @ApiProperty({
    description: 'Supplier identifier',
  })
  readonly id: string;
}
