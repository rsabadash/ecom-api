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
  ApiUnauthorizedResponse,
  ApiNoContentResponse,
  ApiConflictResponse,
} from '@nestjs/swagger';
import { ObjectId } from 'mongodb';
import { UsersService } from './users.service';
import { IUpdateUser, IUserPublic } from './interfaces/users.interfaces';
import { GET_USER_BY_ID_PATH, USERS_ROUTE } from './constants/route.constants';
import { ParseObjectIdPipe } from '../common/pipes/parse-objectId.pipe';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ParseObjectIdsPipe } from '../common/pipes/parse-body-objectId.pipe';
import { USER_ID_PARAM } from './constants/param.constants';
import { PublicUserDto } from './dto/public-user.dto';
import { HttpStatusMessage } from '../common/constants/swagger.constants';
import { USERS_MODULE_NAME } from './constants/swagger.constants';

@ApiTags(USERS_MODULE_NAME)
@Controller(USERS_ROUTE)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOkResponse({
    description: 'List of users were retrieved',
    type: [PublicUserDto],
  })
  @ApiUnauthorizedResponse({
    description: HttpStatusMessage[HttpStatus.UNAUTHORIZED],
  })
  async getUsers(): Promise<IUserPublic[]> {
    return await this.usersService.getUsers();
  }

  @Get(GET_USER_BY_ID_PATH)
  @ApiOkResponse({
    description: 'The user was retrieved',
    type: PublicUserDto,
  })
  @ApiNotFoundResponse({
    description: HttpStatusMessage[HttpStatus.NOT_FOUND],
  })
  @ApiUnauthorizedResponse({
    description: HttpStatusMessage[HttpStatus.UNAUTHORIZED],
  })
  async getUser(
    @Param(USER_ID_PARAM, ParseObjectIdPipe) userId: ObjectId,
  ): Promise<IUserPublic> {
    return await this.usersService.getUser({ userId });
  }

  @Post()
  @ApiCreatedResponse({
    description: 'The user has been successfully created',
    type: PublicUserDto,
  })
  @ApiConflictResponse({
    description: 'User with the email already exists',
  })
  @ApiUnauthorizedResponse({
    description: HttpStatusMessage[HttpStatus.UNAUTHORIZED],
  })
  async createUser(@Body() createUserDto: CreateUserDto): Promise<IUserPublic> {
    return await this.usersService.createUser(createUserDto);
  }

  @UsePipes(new ParseObjectIdsPipe<IUpdateUser>('id', 'string'))
  @Patch()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    description: 'The user has been successfully updated',
  })
  @ApiNotFoundResponse({
    description: HttpStatusMessage[HttpStatus.NOT_FOUND],
  })
  @ApiUnauthorizedResponse({
    description: HttpStatusMessage[HttpStatus.UNAUTHORIZED],
  })
  async updateUser(@Body() updateUserDto: UpdateUserDto): Promise<void> {
    await this.usersService.updateUser(updateUserDto);
  }
}
