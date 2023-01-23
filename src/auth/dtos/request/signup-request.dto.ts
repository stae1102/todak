import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SignupRequestDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  nickname: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
