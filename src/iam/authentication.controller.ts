import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AUTHENTICATION_ROUTE } from '../common/constants/routes.constants';
import {
  REFRESH_TOKEN_PATH,
  SIGN_IN_PATH,
  SIGN_UP_PATH,
} from './constants/path.constants';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { Auth } from './decorators/auth.decorator';
import { AuthType } from './enums/auth-type.enum';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Auth(AuthType.None)
@Controller(AUTHENTICATION_ROUTE)
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}

  @Post(SIGN_UP_PATH)
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post(SIGN_IN_PATH)
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post(REFRESH_TOKEN_PATH)
  refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto);
  }
}
