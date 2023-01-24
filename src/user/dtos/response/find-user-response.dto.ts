import { IsNumber, IsString } from 'class-validator';

export class FindUserResponseDto {
  @IsNumber()
  id: number;

  @IsString()
  password: string;
}
