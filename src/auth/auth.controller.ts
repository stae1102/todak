import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { CookieOptions, Response } from 'express';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AuthService } from './auth.service';
import { SignupRequestDto } from './dtos/request/signup-request.dto';
import { LoginResponseDto } from './dtos/response/login-response.dto';
import { SignupResponseDto } from './dtos/response/signup-response.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // TODO 향후 Interceptor를 도입해 동일한 과정은 생략하도록 개선
  @Post('signup')
  async signup(@Body() signupRequestDto: SignupRequestDto, @Res() response: Response): Promise<void> {
    const user: SignupResponseDto = await this.authService.signup(signupRequestDto);

    const accessToken: string = this.authService.issueAccessToken(user.id);
    const refreshToken: string = this.authService.issueRefreshToken(user.id);
    await this.authService.setRefreshToken(String(user.id), refreshToken);

    const cookieOptions: CookieOptions = this.authService.getCookieOption();
    const responseDto: LoginResponseDto = { accessToken, id: user.id };

    response.cookie('refresh_token', refreshToken, cookieOptions).json(responseDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async signin(@CurrentUser() user: User, @Res() response: Response): Promise<void> {
    // 토큰 발급
    const accessToken: string = this.authService.issueAccessToken(user.id);
    const refreshToken: string = this.authService.issueRefreshToken(user.id);

    // 리프레시 토큰 캐시화
    await this.authService.setRefreshToken(String(user.id), refreshToken);
    const cookieOptions: CookieOptions = this.authService.getCookieOption();
    const responseDto: LoginResponseDto = { accessToken, id: user.id };

    response.cookie('refresh_token', refreshToken, cookieOptions).json(responseDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('signout')
  async signout(@CurrentUser() user: User, @Res({ passthrough: true }) response: Response) {
    await this.authService.delRefreshToken(String(user.id));

    response.clearCookie('refresh_token');
  }
}
