import { IsEmail, IsString } from 'class-validator';

export class SigninRequestDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
