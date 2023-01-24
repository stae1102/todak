import { InjectRedis, RedisService } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';

@Injectable()
export class RedisCacheService {
  constructor(
    @InjectRedis() private readonly redisClient: Redis,
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
  ) {
    this.redisClient = redisService.getClient();
  }

  async get(key: string): Promise<string> {
    return await this.redisClient.get(key);
  }

  async set(key: string, value: any, expire?: number): Promise<'OK'> {
    return await this.redisClient.set(key, value, 'EX', expire ?? 10);
  }

  async del(key: string): Promise<number> {
    return await this.redisClient.del(key);
  }
}
