import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';
//import { UserEntity } from './user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('registration')
  async registration(@Body() userDto: { username: string; password: string }) {
    try {
      const user = await this.userService.registration(userDto);
      return { id: user.id, username: user.username };
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}
