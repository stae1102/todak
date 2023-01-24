import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignupRequestDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  nickname: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
