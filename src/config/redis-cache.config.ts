import { RedisModuleOptions, RedisOptionsFactory } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisConfigService implements RedisOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createRedisOptions(): RedisModuleOptions {
    return {
      config: {
        host: this.configService.get<string>('REDIS_HOSTNAME'),
        port: this.configService.get<number>('REDIS_PORT'),
        password: this.configService.get<string>('REDIS_PASSWORD'),
      },
    };
  }
}
