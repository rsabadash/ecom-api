import { OmitType } from '@nestjs/swagger';
import { SupplierDto } from './supplier.dto';
import { ISupplierCreate } from '../interfaces/suppliers.interfaces';

export class CreateSupplierDto
  extends OmitType(SupplierDto, ['_id'] as const)
  implements ISupplierCreate {}
