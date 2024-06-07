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
import {
  GET_USER_BY_ID_PATH,
  GET_USER_VERIFICATION,
  USERS_ROUTE,
} from './constants/route.constants';
import { CreateUserDto } from './dto/request/create-user.dto';
import { UpdateUserDto } from './dto/request/update-user.dto';
import { USER_ID_PARAM } from './constants/param.constants';
import { Auth } from '../iam/decorators/auth.decorator';
import { AuthType } from '../iam/enums/auth-type.enum';
import { Roles } from '../iam/decorators/roles.decorator';
import { Role } from './enums/role.enum';
import { ApiNoAccessResponse } from '../common/decorators/swagger/api-no-access-response.decorator';
import { HttpErrorDto } from '../common/dto/response/http-error.dto';
import { ERROR, SUCCESS, MODULE_NAME } from './constants/swagger.constants';
import { UserId } from './decorators/user-id.decorator';
import { GetUsersResponseDto } from './dto/response/get-users-response.dto';
import {
  GetUsersResponse,
  GetUserResponse,
  CreateUserResponse,
} from './interfaces/response.interface';
import { GetUserResponseDto } from './dto/response/get-user-response.dto';
import { CreateUserResponseDto } from './dto/response/create-user-response.dto';

@Roles(Role.Admin)
@Auth(AuthType.Bearer)
@Controller(USERS_ROUTE)
@ApiTags(MODULE_NAME)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOkResponse({
    description: SUCCESS.GET_USERS,
    type: [GetUsersResponseDto],
  })
  @ApiNoAccessResponse()
  async getUsers(): Promise<GetUsersResponse[]> {
    return this.usersService.getUsers();
  }

  @Get(GET_USER_VERIFICATION)
  @ApiOkResponse({
    description: SUCCESS.GET_USER_VERIFICATION,
    type: GetUserResponseDto,
  })
  @ApiNotFoundResponse({
    description: ERROR.USER_NOT_FOUND,
    type: HttpErrorDto,
  })
  @ApiNoAccessResponse()
  async getUserVerification(
    @UserId() userId: string,
  ): Promise<GetUserResponse> {
    return this.usersService.getUser({ userId });
  }

  @Get(GET_USER_BY_ID_PATH)
  @ApiOkResponse({
    description: SUCCESS.GET_USER,
    type: GetUserResponseDto,
  })
  @ApiNotFoundResponse({
    description: ERROR.USER_NOT_FOUND,
    type: HttpErrorDto,
  })
  @ApiNoAccessResponse()
  async getUser(
    @Param(USER_ID_PARAM) userId: string,
  ): Promise<GetUserResponse> {
    return this.usersService.getUser({ userId });
  }

  @Post()
  @ApiCreatedResponse({
    description: SUCCESS.CREATE_USER,
    type: CreateUserResponseDto,
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
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<CreateUserResponse> {
    return this.usersService.createUser(createUserDto);
  }

  @Patch()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    description: SUCCESS.UPDATE_USER,
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
