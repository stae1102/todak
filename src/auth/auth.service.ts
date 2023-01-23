import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as argon from 'argon2';
import { SignupRequestDto } from './dtos';
import { RANDOMNICKNAME } from './constants/signup.constant';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async signup(signupRequestDto: SignupRequestDto) {
    // generate the password hash
    const hashedPassword = await argon.hash(signupRequestDto.password);

    // generate a nickname
    if (!signupRequestDto.nickname) {
      const nicknameRequest = await axios.get(RANDOMNICKNAME);
      signupRequestDto.nickname = nicknameRequest.data;
    }

    try {
      // save the new user in the database
      const user = await this.prisma.user.create({
        data: {
          email: signupRequestDto.email,
          password: hashedPassword,
          provider: 'LOCAL',
          nickname: signupRequestDto.nickname,
        },
        select: {
          email: true,
          nickname: true,
          provider: true,
        },
      });
      // return the saved user
      return user;
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          throw new BadRequestException('이미 존재하는 유저입니다.');
        }
      }
      throw new BadRequestException();
    }
  }

