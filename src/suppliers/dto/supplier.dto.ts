import { IsString, IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ISupplier } from '../interfaces/suppliers.interfaces';

export class SupplierDto implements Omit<ISupplier, '_id'> {
  @IsMongoId()
  @ApiProperty({
    description: 'Supplier identifier (returned as ObjectId)',
  })
  readonly _id: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Supplier name',
  })
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({
    description: 'Supplier address',
    nullable: true,
    default: null,
  })
  readonly address: null | string = null;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({
    description: 'Supplier phone number',
    nullable: true,
    default: null,
  })
  readonly phoneNumber: null | string = null;
}
