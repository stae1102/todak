import { Provider } from '@prisma/client';
import { IsEmail, IsEnum, IsString } from 'class-validator';

export class CreateUserRequestDto {
  @IsEmail()
  email: string;

  @IsString()
  nickname: string;

  @IsEnum(Provider)
  provider: Provider;

  @IsString()
  password: string;
}
