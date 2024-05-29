import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ObjectId } from 'mongodb';
import { SupplierEntityResponse } from '../../interfaces/response.interface';
import { DESCRIPTION } from '../../constants/swagger.constants';

export class SupplierResponseDto implements SupplierEntityResponse {
  @ApiProperty(DESCRIPTION.ID)
  readonly _id: ObjectId;

  @ApiProperty(DESCRIPTION.NAME)
  readonly name: string;

  @ApiPropertyOptional(DESCRIPTION.ADDRESS)
  readonly address: string | null;

  @ApiPropertyOptional(DESCRIPTION.PHONE_NUMBER)
  readonly phoneNumber: string | null;
}
