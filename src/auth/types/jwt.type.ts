import { IsString } from 'class-validator';
import { JwtPayload } from 'jsonwebtoken';

export class Payload implements JwtPayload {
  @IsString()
  id: string;
}
