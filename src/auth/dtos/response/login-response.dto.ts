import { IsNumber, IsString } from 'class-validator';

export class LoginResponseDto {
  @IsString()
  accessToken: string;

  @IsNumber()
  id: number;
}
