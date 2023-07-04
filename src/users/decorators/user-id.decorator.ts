import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { RequestExtended } from '../../common/interfaces/request.interface';
import { REQUEST_USER_KEY } from '../../common/constants/request.constants';

export const UserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest() as RequestExtended;

    if (request[REQUEST_USER_KEY]?.sub) {
      return request[REQUEST_USER_KEY].sub;
    }

    throw new UnauthorizedException('jwt malformed');
  },
);
