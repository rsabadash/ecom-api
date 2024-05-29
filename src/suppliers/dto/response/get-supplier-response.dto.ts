import { ApiProperty } from '@nestjs/swagger';
import { ObjectId } from 'mongodb';
import { GetSupplierResponse } from '../../interfaces/response.interface';
import { DESCRIPTION } from '../../constants/swagger.constants';

export class GetSupplierResponseDto implements GetSupplierResponse {
  @ApiProperty(DESCRIPTION.ID)
  readonly _id: ObjectId;

  @ApiProperty(DESCRIPTION.NAME)
  readonly name: string;

  @ApiProperty(DESCRIPTION.ADDRESS)
  readonly address: string | null;

  @ApiProperty(DESCRIPTION.PHONE_NUMBER)
  readonly phoneNumber: string | null;
}
