import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { CreateUserDto } from './dtos/request/create-user.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(createUserDto: CreateUserDto): Promise<Partial<User>> {
    return await this.userRepository.create(createUserDto);
  }

  async findUser(email: string) {
    return await this.userRepository.findUnique(email);
  }
}
