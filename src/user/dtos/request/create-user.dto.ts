import { Provider } from '@prisma/client';
import { IsEmail, IsEnum, IsString } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  nickname: string;

  @IsEnum(Provider)
  provider: Provider;

  @IsString()
  password: string;
}
