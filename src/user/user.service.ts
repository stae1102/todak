import { Injectable } from '@nestjs/common';
import { CreateUserRequestDto } from './dtos/request/create-user-request.dto';
import { CreateUserResponseDto } from './dtos/response/create-user-response.dto';
import { FindUserResponseDto } from './dtos/response/find-user-response.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(createUserDto: CreateUserRequestDto): Promise<CreateUserResponseDto> {
    return await this.userRepository.create(createUserDto);
  }

  async findUser(email: string): Promise<FindUserResponseDto> {
    return await this.userRepository.findUnique(email);
  }
}
