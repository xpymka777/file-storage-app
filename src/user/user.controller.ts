import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { ApiTags } from "@nestjs/swagger";

@ApiTags('User')
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
      throw new UnauthorizedException('Неверные учетные данные.');
    }
    const payload = { username: user.username, userId: user.id };
    // Устанавливаем токен в куки
    response.cookie('access_token', this.jwtService.sign(payload), {
      httpOnly: true,
      maxAge: 86400000, // Например, 1 день в миллисекундах
      path: '/', //доступ к кукам по всем путям
    });
    //пытаемся дёрнуть id
    response.cookie('userId', user.id, {
      httpOnly: true,
      maxAge: 86400000, // Например, 1 день в миллисекундах
      path: '/', //доступ к кукам по всем путям
    });
    const cookies = response.getHeader('Set-Cookie');
    return {
      access_token: this.jwtService.sign(payload), // Возвращаем токен в ответе
      user: { id: user.id, username: user.username }, // Возвращаем информацию о пользователе
      cookies: cookies,
    };
  }
  @Get('logout')
  async logout(
    @Res({ passthrough: true })
    response: Response & {
      clearCookie: (name: string, options?: any) => void;
    },
  ) {
    // Очищаем куки 'access_token'
    response.clearCookie('access_token');
    // Очищаем куки 'userId'
    response.clearCookie('userId');

    // Возвращаем сообщение об успешном выходе из системы
    return { message: 'Выход из системы прошел успешно' };
  }
}
