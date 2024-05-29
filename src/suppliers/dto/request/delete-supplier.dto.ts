import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';
import { DeleteSupplier } from '../../interfaces/supplier.interface';
import { DESCRIPTION } from '../../constants/swagger.constants';

export class DeleteSupplierDto implements DeleteSupplier {
  @IsMongoId()
  @ApiProperty(DESCRIPTION.ID)
  readonly id: string;
}
