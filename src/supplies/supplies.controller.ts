import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from '../iam/decorators/roles.decorator';
import { Role } from '../users/enums/role.enums';
import { Auth } from '../iam/decorators/auth.decorator';
import { AuthType } from '../iam/enums/auth-type.enum';
import { SUPPLIES_ROUTE } from './constants/route.constants';
import { SUPPLIES_MODULE_NAME } from './constants/swagger.constants';
import { SuppliesService } from './supplies.service';
import { ISupply } from './interfaces/supplies.interfaces';

@Roles(Role.Admin)
@Auth(AuthType.Bearer)
@Controller(SUPPLIES_ROUTE)
@ApiTags(SUPPLIES_MODULE_NAME)
export class SuppliesController {
  constructor(private readonly suppliesService: SuppliesService) {}

  @Post()
  async createSupply(@Body() createSupplyDto: any): Promise<ISupply> {
    return await this.suppliesService.createSupply(createSupplyDto);
  }
}
