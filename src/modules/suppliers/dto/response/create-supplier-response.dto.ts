import { CreateSupplierResponse } from '../../interfaces/response.interface';
import { ApiProperty } from '@nestjs/swagger';
import { DESCRIPTION } from '../../constants/swagger.constants';
import { ObjectId } from 'mongodb';

export class CreateSupplierResponseDto implements CreateSupplierResponse {
  @ApiProperty(DESCRIPTION.ID)
  readonly _id: ObjectId;

  @ApiProperty(DESCRIPTION.NAME)
  readonly name: string;

  @ApiProperty(DESCRIPTION.ADDRESS)
  readonly address: string | null;

  @ApiProperty(DESCRIPTION.PHONE_NUMBER)
  readonly phoneNumber: string | null;
}
