import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiForbiddenResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { HttpStatusMessage } from '../../constants/swagger.constants';
import { HttpErrorDto } from '../../dto/swagger/http-error.dto';

interface ApiNoAccessDecoratorArgs {
  desc401?: string;
  desc403?: string;
}

export const ApiNoAccessResponse = (
  descriptions: ApiNoAccessDecoratorArgs = {},
) => {
  return applyDecorators(
    ApiUnauthorizedResponse({
      description:
        descriptions.desc401 || HttpStatusMessage[HttpStatus.UNAUTHORIZED],
      type: HttpErrorDto,
    }),
    ApiForbiddenResponse({
      description:
        descriptions.desc403 || HttpStatusMessage[HttpStatus.FORBIDDEN],
      type: HttpErrorDto,
    }),
  );
};
