import { IsNumber } from 'class-validator';

export class CreateUserResponseDto {
  @IsNumber()
  id: number;
}
