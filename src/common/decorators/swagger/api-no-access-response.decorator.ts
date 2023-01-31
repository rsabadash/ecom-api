import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiForbiddenResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { HttpStatusMessage } from '../../constants/swagger.constants';
import { HttpErrorDto } from '../../dto/swagger/http-error.dto';

export const ApiNoAccessResponse = () => {
  const desc401 = `
    'jwt malformed'
    'jwt expired'
  `;

  return applyDecorators(
    ApiUnauthorizedResponse({
      description: desc401,
      type: HttpErrorDto,
    }),
    ApiForbiddenResponse({
      description: `${HttpStatusMessage[HttpStatus.FORBIDDEN]}`,
      type: HttpErrorDto,
    }),
  );
};
