import { IsNumber } from 'class-validator';

export class SignupResponseDto {
  @IsNumber()
  id: number;
}
