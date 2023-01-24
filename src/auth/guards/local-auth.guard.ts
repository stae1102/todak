import { BadRequestException, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  constructor() {
    super();
  }

  handleRequest<TUser = any>(err: any, user: any, _info: any, _context: ExecutionContext, _status?: any): TUser {
    if (!user) {
      throw new BadRequestException('적절하지 않은 요청입니다.');
    }
    return user;
  }
}
