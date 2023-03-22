import { ObjectId } from 'mongodb';
import { IsString, IsOptional, IsMongoId } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ISupplier } from '../interfaces/suppliers.interfaces';

export class SupplierDto implements ISupplier {
  @IsMongoId()
  @ApiProperty({
    type: 'string',
    description: 'Identifier of the supplier',
  })
  readonly _id: ObjectId;

  @IsString()
  @ApiProperty({
    description: 'Name of the supplier',
  })
  readonly name: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Additional information of the supplier',
    nullable: true,
    default: null,
  })
  readonly note: null | string = null;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Address of the supplier',
    nullable: true,
    default: null,
  })
  readonly address: null | string = null;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Phone number of the supplier',
    nullable: true,
    default: null,
  })
  readonly phoneNumber: null | string = null;
}
