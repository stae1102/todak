import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserRequestDto } from './dtos/request/create-user-request.dto';
import { CreateUserResponseDto } from './dtos/response/create-user-response.dto';
import { FindUserResponseDto } from './dtos/response/find-user-response.dto';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserRequestDto): Promise<CreateUserResponseDto> {
    return await this.prisma.user.create({
      data: { ...createUserDto },
      select: { id: true },
    });
  }

  async findUnique(email: string): Promise<FindUserResponseDto> {
    return await this.prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        password: true,
      },
    });
  }
}
