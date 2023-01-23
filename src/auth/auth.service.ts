import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as argon from 'argon2';
import { SignupRequestDto, SigninRequestDto } from './dtos';
import axios from 'axios';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { RANDOMNICKNAME } from './constants/signup.constant';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
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

  async signin(signinRequestDto: SigninRequestDto) {
    // find the user by email
    // if user does not exist throw exception
    const exUser = await this.prisma.user.findUnique({
      where: {
        email: signinRequestDto.email,
      },
    });

    if (!exUser) {
      throw new NotFoundException('존재하지 않는 유저입니다.');
    }

    // compare password
    const pwMatches = await argon.verify(exUser.password, signinRequestDto.password);

    if (!pwMatches) {
      throw new BadRequestException('비밀번호가 일치하지 않습니다.');
    }

    delete exUser.password;
    return exUser;
  }

