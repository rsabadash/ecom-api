import { ObjectId } from 'mongodb';
import {
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  Length,
  IsMongoId,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SupplierDto {
  @IsString()
  @IsMongoId()
  @ApiProperty({
    type: 'string',
    description: 'Identifier of the supplier',
  })
  readonly _id: ObjectId;

  @IsString()
  @MinLength(3, {
    message:
      'Name is too short. Minimal length is $constraint1 characters, but actual is $value',
  })
  @MaxLength(50, {
    message:
      'Name is too long. Maximal length is $constraint1 characters, but actual is $value',
  })
  @ApiProperty({
    description: "Supplier's name",
    minimum: 3,
    maximum: 50,
  })
  readonly name: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: "Supplier's additional information",
  })
  readonly note: string | null = null;

  @IsString()
  @IsOptional()
  @IsMongoId()
  @ApiPropertyOptional({
    type: 'string',
    description: "Supplier's bill identifier",
  })
  readonly accountId: ObjectId | null = null;

  @IsString()
  @IsOptional()
  @MaxLength(256, {
    message:
      'Supplier address is too long. Maximal length is $constraint1 characters, but actual is $value',
  })
  @ApiPropertyOptional({
    description: "Supplier's address",
    maximum: 256,
  })
  readonly address: string | null = null;

  @IsString()
  @Length(10, 10)
  @IsOptional()
  @ApiPropertyOptional({
    description: "Supplier's phone number",
    minimum: 10,
    maximum: 10,
  })
  readonly phoneNumber: string | null = null;
}
