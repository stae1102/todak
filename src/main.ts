import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        // ts 반영 타입으로 변환
        enableImplicitConversion: true,
      },
      whitelist: true,
    }),
  );
  await app.listen(3000);
}
bootstrap();
