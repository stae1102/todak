import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupRequestDto } from './dtos';
import { SigninRequestDto } from './dtos/request/signin-request.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() signupRequestDto: SignupRequestDto) {
    return this.authService.signup(signupRequestDto);
  }

  @Post('signin')
  signin(@Body() signinRequestDto: SigninRequestDto) {
    return this.authService.signin(signinRequestDto);
  }
}
