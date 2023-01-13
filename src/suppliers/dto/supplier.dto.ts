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
  @IsOptional()
  @IsMongoId()
  @ApiProperty({
    description: 'Supplier objectId',
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
    description: 'The name of particular supplier',
    minimum: 3,
    maximum: 50,
  })
  readonly name: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Some information about supplier',
  })
  readonly note: string;

  @IsString()
  @IsOptional()
  @IsMongoId()
  @ApiPropertyOptional({
    description: 'Supplier account id / bank id (to retrieve account data)',
  })
  readonly accountId: string;

  @IsString()
  @IsOptional()
  @MaxLength(256, {
    message:
      'Supplier address is too long. Maximal length is $constraint1 characters, but actual is $value',
  })
  @ApiPropertyOptional({
    description: 'Supplier address',
    maximum: 256,
  })
  readonly address: string;

  @IsString()
  @Length(10, 10)
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Supplier phone number',
    minimum: 10,
    maximum: 10,
  })
  readonly phoneNumber: string;
}
