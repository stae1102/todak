import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TokenExpiredError } from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }

  handleRequest<TUser = any>(err: any, user: any, info: any, context: ExecutionContext, status?: any): TUser {
    if (info instanceof TokenExpiredError) {
      throw new UnauthorizedException('토큰을 재발급해주세요.');
    }

    if (!user) {
      throw new UnauthorizedException('유효하지 않은 요청입니다.');
    }

    return user;
  }
}
