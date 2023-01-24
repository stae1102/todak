import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as argon from 'argon2';
import { SignupRequestDto } from './dtos/request/signup-request.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { ConfigService } from '@nestjs/config';
import { EXPIRATION } from '../../libs/consts';
import { UserService } from '../user/user.service';
import { AuthRepository } from './auth.repository';
import { CookieOptions } from 'express';
import * as URL from 'url';
import { SignupResponseDto } from './dtos/response/signup-response.dto';
import { CreateUserResponseDto } from '../user/dtos/response/create-user-response.dto';
import { FindUserResponseDto } from '../user/dtos/response/find-user-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly authRepository: AuthRepository,
  ) {}

  async validateUser(email: string, password: string): Promise<number> {
    const exUser: FindUserResponseDto = await this.userService.findUser(email);

    if (!exUser) {
      throw new NotFoundException('존재하지 않는 유저입니다.');
    }

    const psMatches: boolean = await argon.verify(exUser.password, password);

    if (!psMatches) {
      throw new BadRequestException('비밀번호가 일치하지 않습니다.');
    }

    return exUser.id;
  }

  async signup(signupRequestDto: SignupRequestDto): Promise<SignupResponseDto> {
    // generate the password hash
    const hashedPassword: string = await argon.hash(signupRequestDto.password);

    try {
      // save the new user in the database
      const user: CreateUserResponseDto = await this.userService.createUser({
        email: signupRequestDto.email,
        password: hashedPassword,
        provider: 'LOCAL',
        nickname: signupRequestDto.nickname,
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

  // async signin(signinRequestDto: SigninRequestDto) {
  //   // find the user by email
  //   // if user does not exist throw exception
  //   const exUser = await this.prisma.user.findUnique({
  //     where: {
  //       email: signinRequestDto.email,
  //     },
  //   });

  //   if (!exUser) {
  //     throw new NotFoundException('존재하지 않는 유저입니다.');
  //   }

  //   // compare password
  //   const pwMatches = await argon.verify(exUser.password, signinRequestDto.password);

  //   if (!pwMatches) {
  //     throw new BadRequestException('비밀번호가 일치하지 않습니다.');
  //   }

  //   delete exUser.password;
  //   return exUser;
  // }

  issueAccessToken(userId: number): string {
    return this.jwtService.sign(
      { userId },
      {
        expiresIn: EXPIRATION.ACCESS_TOKEN,
        secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
      },
    );
  }

  issueRefreshToken(userId: number): string {
    return this.jwtService.sign(
      { userId },
      {
        expiresIn: EXPIRATION.REFRESH_TOKEN,
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      },
    );
  }

  async setRefreshToken(userId: string, refreshToken: string): Promise<void> {
    await this.authRepository.create(userId, refreshToken);
  }

  getCookieOption = (): CookieOptions => {
    const maxAge = EXPIRATION.REFRESH_TOKEN * 1000;

    const domain = URL.parse(this.configService.get('CLIENT_URL')).host;

    if (this.configService.get('NODE_ENV') === 'production') {
      return { httpOnly: true, secure: true, sameSite: 'lax', maxAge, domain };
    } else if (this.configService.get('NODE_ENV') === 'alpha') {
      return { httpOnly: true, secure: true, sameSite: 'none', maxAge, domain };
    }

    return { httpOnly: true, maxAge };
  };
}
