import { SetMetadata } from '@nestjs/common';
import { Role } from '../enums/role.enums';

export const ROLES_KEY = 'roles';

export const Roles = (...roles: Role[]) => {
  return SetMetadata(ROLES_KEY, roles);
};
