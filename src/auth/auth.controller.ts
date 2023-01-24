import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { SignupRequestDto } from './dtos';
import { SigninRequestDto } from './dtos/request/signin-request.dto';
import { LoginResponseDto } from './dtos/response/login-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() signupRequestDto: SignupRequestDto) {
    const user = await this.authService.signup(signupRequestDto);

    // 토큰 발급
    const accessToken = this.authService.issueAccessToken(user.id);
    const refreshToken = this.authService.issueRefreshToken(user.id);

    return { accessToken, refreshToken };
  }

  @Post('signin')
  async signin(@Body() signinRequestDto: SigninRequestDto, @Res() response: Response) {
    const user = await this.authService.signin(signinRequestDto);

    // 토큰 발급
    const accessToken = this.authService.issueAccessToken(user.id);
    const refreshToken = this.authService.issueRefreshToken(user.id);

    // 리프레시 토큰 캐시화
    await this.authService.setRefreshToken(String(user.id), refreshToken);
    const cookieOptions = this.authService.getCookieOption();
    const responseDto: LoginResponseDto = { accessToken, id: user.id };

    response.cookie('refresh_token', refreshToken, cookieOptions).json(responseDto);
  }
}
