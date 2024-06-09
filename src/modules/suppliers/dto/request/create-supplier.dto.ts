import { ApiProperty } from '@nestjs/swagger';
import { CreateSupplier } from '../../interfaces/supplier.interface';
import { IsNotEmpty, IsString, ValidateIf } from 'class-validator';
import { DESCRIPTION } from '../../constants/swagger.constants';

export class CreateSupplierDto implements CreateSupplier {
  @IsString()
  @IsNotEmpty()
  @ApiProperty(DESCRIPTION.NAME)
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  @ValidateIf((_, value) => value !== null)
  @ApiProperty(DESCRIPTION.ADDRESS)
  readonly address: string | null = null;

  @IsString()
  @IsNotEmpty()
  @ValidateIf((_, value) => value !== null)
  @ApiProperty(DESCRIPTION.PHONE_NUMBER)
  readonly phoneNumber: string | null = null;
}
