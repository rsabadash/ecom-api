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
import { SignUpDto } from './dto/request/sign-up.dto';
import { SignInDto } from './dto/request/sign-in.dto';
import { Auth } from './decorators/auth.decorator';
import { AuthType } from './enums/auth-type.enum';
import { RefreshTokenDto } from './dto/request/refresh-token.dto';
import { MODULE_NAME, SUCCESS, ERROR } from './constants/swagger.constants';
import { ApiNoAccessResponse } from '../../common/decorators/swagger/api-no-access-response.decorator';
import { HttpErrorDto } from '../../common/dto/response/http-error.dto';
import { SignUpResponseDto } from './dto/response/sign-up-response.dto';
import {
  RefreshTokenResponse,
  SignInResponse,
  SignUpResponse,
} from './interfaces/response.interface';
import { SignInResponseDto } from './dto/response/sign-in-response.dto';
import { RefreshTokenResponseDto } from './dto/response/refresh-token-response.dto';

@Auth(AuthType.None)
@Controller(AUTHENTICATION_ROUTE)
@ApiTags(MODULE_NAME)
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}

  @Post(SIGN_UP_PATH)
  @ApiCreatedResponse({
    description: SUCCESS.SIGN_UP,
    type: SignUpResponseDto,
  })
  @ApiConflictResponse({
    description: ERROR.SIGN_UP_EMAIL_EXISTS,
    type: HttpErrorDto,
  })
  @ApiBadRequestResponse({
    description: ERROR.SIGN_UP_NOT_CREATED,
    type: HttpErrorDto,
  })
  signUp(@Body() signUpDto: SignUpDto): Promise<SignUpResponse> {
    return this.authService.signUp(signUpDto);
  }

  @Post(SIGN_IN_PATH)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: SUCCESS.SIGN_IN,
    type: SignInResponseDto,
  })
  @ApiNotFoundResponse({
    description: ERROR.SIGN_IN_NOT_FOUND,
    type: HttpErrorDto,
  })
  @ApiUnauthorizedResponse({
    description: ERROR.SIGN_IN_NOT_AUTHORIZED,
    type: HttpErrorDto,
  })
  signIn(@Body() signInDto: SignInDto): Promise<SignInResponse> {
    return this.authService.signIn(signInDto);
  }

  @Post(REFRESH_TOKEN_PATH)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: SUCCESS.REFRESH_TOKEN,
    type: RefreshTokenResponseDto,
  })
  @ApiBadRequestResponse({
    description: ERROR.TOKEN_MALFORMED,
    type: HttpErrorDto,
  })
  @ApiNotFoundResponse({
    description: ERROR.SIGN_IN_NOT_FOUND,
    type: HttpErrorDto,
  })
  @ApiNoAccessResponse()
  refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<RefreshTokenResponse> {
    return this.authService.refreshToken(refreshTokenDto);
  }
}
