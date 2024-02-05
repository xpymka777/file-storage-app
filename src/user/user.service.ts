import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm'; // Добавьте FindOneOptions
import { UserEntity } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async registration(userDto: {
    username: string;
    password: string;
  }): Promise<UserEntity> {
    const existingUser = await this.userRepository.findOne({
      where: { username: userDto.username }, // Используйте where для поиска по username
    });
    if (existingUser) {
      throw new UnauthorizedException('Username is already taken');
    }

    const hashedPassword = await bcrypt.hash(userDto.password, 10);
    const user = new UserEntity();
    user.username = userDto.username;
    user.password = hashedPassword;

    return this.userRepository.save(user);
  }

  async findOne(username: string): Promise<UserEntity | undefined> {
    return this.userRepository.findOne({
      where: { username },
    });
  }
}
