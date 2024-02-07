import {
  Body,
  Controller,
  Post,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('registration')
  async registration(@Body() userDto: { username: string; password: string }) {
    try {
      const user = await this.userService.registration(userDto);
      return { id: user.id, username: user.username };
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }

  @Post('login')
  async login(
    @Body() loginDto: { username: string; password: string },
    @Res({ passthrough: true })
    response: Response & {
      cookie: (name: string, value: string, options?: any) => void;
    },
  ) {
    const user = await this.userService.validateUser(
      loginDto.username,
      loginDto.password,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { username: user.username, userId: user.id };

    // Устанавливаем токен в куки
    response.cookie('access_token', this.jwtService.sign(payload), {
      httpOnly: true,
    });

    return {
      access_token: this.jwtService.sign(payload), // Возвращаем токен в ответе
      user: { id: user.id, username: user.username }, // Возвращаем информацию о пользователе
    };
  }
}
