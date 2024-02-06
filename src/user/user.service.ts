import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import * as bcrypt from 'bcrypt';
import { FolderEntity } from '../folder/folder.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(FolderEntity)
    private readonly folderRepository: Repository<FolderEntity>,
  ) {}

  async registration(userDto: {
    username: string;
    password: string;
  }): Promise<UserEntity> {
    const existingUser = await this.userRepository.findOne({
      where: { username: userDto.username },
    });

    if (existingUser) {
      throw new UnauthorizedException('Имя пользователя занято.');
    }

    const hashedPassword = await bcrypt.hash(userDto.password, 10);

    // Создание пользователя
    const user = new UserEntity();
    user.username = userDto.username;
    user.password = hashedPassword;

    // Сохранение пользователя
    const savedUser = await this.userRepository.save(user);

    // Создание корневой папки для нового пользователя с привязкой к пользователю
    const rootFolder = new FolderEntity();
    rootFolder.name = 'root';
    rootFolder.parentId = null;
    rootFolder.user = savedUser;

    // Передача id пользователя корневой папке
    rootFolder.user = await Promise.resolve(savedUser);

    // Сохранение корневой папки
    await this.folderRepository.save(rootFolder);

    return savedUser;
  }

  async findOne(username: string): Promise<UserEntity | undefined> {
    return this.userRepository.findOne({
      where: { username },
    });
  }

  async validateUser(
    username: string,
    password: string,
  ): Promise<UserEntity | null> {
    const user = await this.userRepository.findOne({ where: { username } });
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }
}
