import { Injectable } from '@nestjs/common';
import { EXPIRATION } from '../../libs/consts';
import { RedisCacheService } from '../config/redis-cache.service';

@Injectable()
export class AuthRepository {
  constructor(private readonly redis: RedisCacheService) {}

  async create(userId: string, refreshToken: string): Promise<void> {
    await this.redis.set(userId, refreshToken, EXPIRATION.REFRESH_TOKEN);
  }
}
