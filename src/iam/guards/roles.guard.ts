import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ObjectId } from 'mongodb';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '../../users/enums/role.enums';
import { UsersService } from '../../users/users.service';
import { RequestExtended } from '../../common/interfaces/request.interface';
import { REQUEST_USER_KEY } from '../../common/constants/request.constants';
import { IUserPublic } from '../../users/interfaces/users.interfaces';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly usersService: UsersService,
  ) {}

  private hasAllAccesses(user: IUserPublic): boolean {
    return !!user.roles.find((role) => role === Role.Admin);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const contextRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!contextRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest() as RequestExtended;

    if (request[REQUEST_USER_KEY]?.sub) {
      const user = await this.usersService.getUser({
        userId: new ObjectId(request[REQUEST_USER_KEY].sub),
      });

      const hasAllAccesses = this.hasAllAccesses(user);

      return (
        hasAllAccesses ||
        contextRoles.some((role) => user.roles.find((r) => r === role))
      );
    }

    return false;
  }
}
