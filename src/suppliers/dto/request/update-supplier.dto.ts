import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { UpdateSupplier } from '../../interfaces/supplier.interface';
import { DESCRIPTION } from '../../constants/swagger.constants';

export class UpdateSupplierDto implements UpdateSupplier {
  @IsMongoId()
  @ApiProperty(DESCRIPTION.ID)
  readonly id: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiPropertyOptional(DESCRIPTION.NAME)
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ValidateIf((_, value) => value !== null)
  @ApiPropertyOptional(DESCRIPTION.ADDRESS)
  readonly address: string | null = null;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ValidateIf((_, value) => value !== null)
  @ApiPropertyOptional(DESCRIPTION.PHONE_NUMBER)
  readonly phoneNumber: string | null = null;
}
