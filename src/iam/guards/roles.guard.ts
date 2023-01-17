import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ObjectId } from 'mongodb';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '../../users/enums/role.enums';
import { UsersService } from '../../users/users.service';
import { AccessTokenGuard } from './access-token.guard';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly usersService: UsersService,
    private readonly accessTokenGuard: AccessTokenGuard,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const contextRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!contextRoles) {
      return true;
    }

    const user = await this.usersService.getUser({
      userId: new ObjectId(this.accessTokenGuard.decodedToken.sub),
    });

    return contextRoles.some((role) => user.roles.find((r) => r === role));
  }
}
