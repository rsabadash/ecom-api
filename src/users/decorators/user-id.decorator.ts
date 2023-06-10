import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { RequestExtended } from '../../common/interfaces/request.interface';
import { REQUEST_USER_KEY } from '../../common/constants/request.constants';

export const UserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): ObjectId => {
    const request = ctx.switchToHttp().getRequest() as RequestExtended;

    if (request[REQUEST_USER_KEY]?.sub) {
      return new ObjectId(request[REQUEST_USER_KEY].sub);
    }

    throw new UnauthorizedException('jwt malformed');
  },
);
