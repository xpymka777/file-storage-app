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
import { ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  // Регистрация пользователя
  @Post('registration')
  async registration(@Body() userDto: { username: string; password: string }) {
    try {
      // Вызываем сервис для регистрации пользователя
      const user = await this.userService.registration(userDto);
      // Возвращаем информацию о зарегистрированном пользователе
      return { id: user.id, username: user.username };
    } catch (error) {
      // В случае ошибки при регистрации выбрасываем исключение с сообщением
      throw new UnauthorizedException(error.message);
    }
  }

  // Вход пользователя
  @Post('login')
  async login(
    @Body() loginDto: { username: string; password: string },
    @Res({ passthrough: true })
    response: Response & {
      cookie: (name: string, value: string, options?: any) => void;
    },
  ) {
    // Валидируем учетные данные пользователя
    const user = await this.userService.validateUser(
      loginDto.username,
      loginDto.password,
    );

    // Если пользователь не найден, выбрасываем исключение
    if (!user) {
      throw new UnauthorizedException('Неверные учетные данные.');
    }

    // Генерируем payload для токена
    const payload = { username: user.username, userId: user.id };

    // Устанавливаем токен в куки
    response.cookie('access_token', this.jwtService.sign(payload), {
      httpOnly: true,
      maxAge: 86400000, // 1 день в миллисекундах
      path: '/', // Доступ к кукам по всем путям
    });

    // Устанавливаем id пользователя в куки
    response.cookie('userId', user.id, {
      httpOnly: true,
      maxAge: 86400000, // 1 день в миллисекундах
      path: '/', // Доступ к кукам по всем путям
    });

    // Получаем установленные куки из заголовка ответа
    const cookies = response.getHeader('Set-Cookie');

    // Возвращаем информацию о токене, пользователе и установленных куки
    return {
      access_token: this.jwtService.sign(payload), // Токен в ответе
      user: { id: user.id, username: user.username }, // Информация о пользователе
      cookies: cookies, // Установленные куки
    };
  }

  // Выход пользователя из системы
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
