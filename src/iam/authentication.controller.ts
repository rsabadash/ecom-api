import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthenticationService } from './authentication.service';
import {
  AUTHENTICATION_ROUTE,
  REFRESH_TOKEN_PATH,
  SIGN_IN_PATH,
  SIGN_UP_PATH,
} from './constants/route.constants';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { Auth } from './decorators/auth.decorator';
import { AuthType } from './enums/auth-type.enum';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { IUserPublic } from '../users/interfaces/users.interfaces';
import { Tokens } from './interfaces/jwt.interfaces';
import { PublicUserDto } from '../users/dto/public-user.dto';
import { TokensDto } from './dto/tokens-dto';
import { AUTH_MODULE_NAME } from './constants/swagger.constants';
import { ApiNoAccessResponse } from '../common/decorators/swagger/api-no-access-response.decorator';
import { HttpErrorDto } from '../common/dto/swagger/http-error.dto';

@ApiTags(AUTH_MODULE_NAME)
@Controller(AUTHENTICATION_ROUTE)
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}

  @Auth(AuthType.None)
  @Post(SIGN_UP_PATH)
  @ApiCreatedResponse({
    description: 'The user has been signed up',
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
  signUp(@Body() signUpDto: SignUpDto): Promise<IUserPublic> {
    return this.authService.signUp(signUpDto);
  }

  @Auth(AuthType.None)
  @Post(SIGN_IN_PATH)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'The user has been signed in',
    type: TokensDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Email or password do not match',
    type: HttpErrorDto,
  })
  signIn(@Body() signInDto: SignInDto): Promise<Tokens> {
    return this.authService.signIn(signInDto);
  }

  @Auth(AuthType.Bearer)
  @Post(REFRESH_TOKEN_PATH)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'The user got a new pair of tokens',
    type: TokensDto,
  })
  @ApiBadRequestResponse({
    description: 'JWT malformed or invalid JWT options',
    type: HttpErrorDto,
  })
  @ApiNotFoundResponse({
    description: 'The user has not been found',
    type: HttpErrorDto,
  })
  @ApiNoAccessResponse()
  refreshToken(@Body() refreshTokenDto: RefreshTokenDto): Promise<Tokens> {
    return this.authService.refreshToken(refreshTokenDto);
  }
}
