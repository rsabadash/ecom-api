import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiNoContentResponse,
  ApiConflictResponse,
  ApiBadRequestResponse,
  ApiGoneResponse,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { IUserPublic } from './interfaces/users.interfaces';
import {
  GET_USER_BY_ID_PATH,
  GET_USER_VERIFICATION,
  USERS_ROUTE,
} from './constants/route.constants';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { USER_ID_PARAM } from './constants/param.constants';
import { PublicUserDto } from './dto/public-user.dto';
import { Auth } from '../iam/decorators/auth.decorator';
import { AuthType } from '../iam/enums/auth-type.enum';
import { Roles } from '../iam/decorators/roles.decorator';
import { Role } from '../iam/enums/role.enums';
import { ApiNoAccessResponse } from '../common/decorators/swagger/api-no-access-response.decorator';
import { HttpErrorDto } from '../common/dto/response/http-error.dto';
import { ERROR, SWAGGER_DESCRIPTION } from './constants/message.constants';
import { MODULE_NAME } from '../common/constants/swagger.constants';
import { UserId } from './decorators/user-id.decorator';

@Roles(Role.Admin)
@Auth(AuthType.Bearer)
@Controller(USERS_ROUTE)
@ApiTags(MODULE_NAME.USERS)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOkResponse({
    description: SWAGGER_DESCRIPTION.GET_USERS,
    type: [PublicUserDto],
  })
  @ApiNoAccessResponse()
  async getUsers(): Promise<IUserPublic[]> {
    return this.usersService.getUsers();
  }

  @Get(GET_USER_VERIFICATION)
  @ApiOkResponse({
    description: SWAGGER_DESCRIPTION.GET_USER_VERIFICATION,
    type: PublicUserDto,
  })
  @ApiNotFoundResponse({
    description: ERROR.USER_NOT_FOUND,
    type: HttpErrorDto,
  })
  @ApiNoAccessResponse()
  async getUserVerification(@UserId() userId: string): Promise<IUserPublic> {
    return this.usersService.getUser({ userId });
  }

  @Get(GET_USER_BY_ID_PATH)
  @ApiOkResponse({
    description: SWAGGER_DESCRIPTION.GET_USER,
    type: PublicUserDto,
  })
  @ApiNotFoundResponse({
    description: ERROR.USER_NOT_FOUND,
    type: HttpErrorDto,
  })
  @ApiNoAccessResponse()
  async getUser(@Param(USER_ID_PARAM) userId: string): Promise<IUserPublic> {
    return this.usersService.getUser({ userId });
  }

  @Post()
  @ApiCreatedResponse({
    description: SWAGGER_DESCRIPTION.CREATE_USER,
    type: PublicUserDto,
  })
  @ApiConflictResponse({
    description: ERROR.EMAIL_EXISTS,
    type: HttpErrorDto,
  })
  @ApiBadRequestResponse({
    description: ERROR.USER_NOT_CREATED,
    type: HttpErrorDto,
  })
  @ApiNoAccessResponse()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<IUserPublic> {
    return this.usersService.createUser(createUserDto);
  }

  @Patch()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    description: SWAGGER_DESCRIPTION.UPDATE_USER,
  })
  @ApiNotFoundResponse({
    description: ERROR.USER_NOT_FOUND,
    type: HttpErrorDto,
  })
  @ApiConflictResponse({
    description: ERROR.EMAIL_EXISTS,
    type: HttpErrorDto,
  })
  @ApiGoneResponse({
    description: ERROR.USER_NOT_UPDATED,
    type: HttpErrorDto,
  })
  @ApiNoAccessResponse()
  async updateUser(@Body() updateUserDto: UpdateUserDto): Promise<void> {
    await this.usersService.updateUser(updateUserDto);
  }
}
