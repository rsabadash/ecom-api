import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UsePipes,
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
import { ObjectId } from 'mongodb';
import { UsersService } from './users.service';
import { IUpdateUser, IUserPublic } from './interfaces/users.interfaces';
import {
  GET_USER_BY_ID_PATH,
  GET_USER_SIGN_IN,
  USERS_ROUTE,
} from './constants/route.constants';
import { ParseObjectIdPipe } from '../common/pipes/parse-objectId.pipe';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ParseObjectIdsPipe } from '../common/pipes/parse-body-objectId.pipe';
import { USER_ID_PARAM } from './constants/param.constants';
import { PublicUserDto } from './dto/public-user.dto';
import { USERS_MODULE_NAME } from './constants/swagger.constants';
import { Auth } from '../iam/decorators/auth.decorator';
import { AuthType } from '../iam/enums/auth-type.enum';
import { Roles } from '../iam/decorators/roles.decorator';
import { Role } from './enums/role.enums';
import { ApiNoAccessResponse } from '../common/decorators/swagger/api-no-access-response.decorator';
import { HttpErrorDto } from '../common/dto/swagger/http-error.dto';
import { UserId } from './decorators/user-id.decorator';

@Roles(Role.Admin)
@Auth(AuthType.Bearer)
@Controller(USERS_ROUTE)
@ApiTags(USERS_MODULE_NAME)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOkResponse({
    description: 'List of users was retrieved',
    type: [PublicUserDto],
  })
  @ApiNoAccessResponse()
  async getUsers(): Promise<IUserPublic[]> {
    return await this.usersService.getUsers();
  }

  @Get(GET_USER_SIGN_IN)
  @ApiOkResponse({
    description: 'The user was retrieved',
    type: PublicUserDto,
  })
  @ApiNotFoundResponse({
    description: 'The user has not been found',
    type: HttpErrorDto,
  })
  @ApiNoAccessResponse()
  async getUserSignIn(@UserId() userId: ObjectId): Promise<IUserPublic> {
    return await this.usersService.getUser({ userId });
  }

  @Get(GET_USER_BY_ID_PATH)
  @ApiOkResponse({
    description: 'The user was retrieved',
    type: PublicUserDto,
  })
  @ApiNotFoundResponse({
    description: 'The user has not been found',
    type: HttpErrorDto,
  })
  @ApiNoAccessResponse()
  async getUser(
    @Param(USER_ID_PARAM, ParseObjectIdPipe) userId: ObjectId,
  ): Promise<IUserPublic> {
    return await this.usersService.getUser({ userId });
  }

  @Post()
  @ApiCreatedResponse({
    description: 'The user has been created',
    type: PublicUserDto,
  })
  @ApiConflictResponse({
    description: 'User with the email already exists',
    type: HttpErrorDto,
  })
  @ApiBadRequestResponse({
    description: 'The user has not been created',
    type: HttpErrorDto,
  })
  @ApiNoAccessResponse()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<IUserPublic> {
    return await this.usersService.createUser(createUserDto);
  }

  @Patch()
  @HttpCode(HttpStatus.NO_CONTENT)
  @UsePipes(new ParseObjectIdsPipe<IUpdateUser>('id', 'string'))
  @ApiNoContentResponse({
    description: 'The user has been updated',
  })
  @ApiNotFoundResponse({
    description: 'The user has not been found',
    type: HttpErrorDto,
  })
  @ApiConflictResponse({
    description: 'User with the email already exists',
    type: HttpErrorDto,
  })
  @ApiGoneResponse({
    description: 'The user has not been updated',
    type: HttpErrorDto,
  })
  @ApiNoAccessResponse()
  async updateUser(@Body() updateUserDto: UpdateUserDto): Promise<void> {
    await this.usersService.updateUser(updateUserDto);
  }
}
