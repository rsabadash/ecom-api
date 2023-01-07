import {
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  Length,
  IsMongoId,
} from 'class-validator';

export class UpdateSupplierDto {
  @IsString()
  @IsOptional()
  @IsMongoId()
  readonly _id: string;

  @IsString()
  @MinLength(3, {
    message:
      'Name is too short. Minimal length is $constraint1 characters, but actual is $value',
  })
  @MaxLength(50, {
    message:
      'Name is too long. Maximal length is $constraint1 characters, but actual is $value',
  })
  readonly name: string;

  @IsString()
  @IsOptional()
  readonly note: string;

  @IsString()
  @IsOptional()
  @IsMongoId()
  readonly accountId: string;

  @IsString()
  @IsOptional()
  readonly address: string;

  @IsString()
  @Length(10, 10)
  @IsOptional()
  readonly phoneNumber: string;
}
