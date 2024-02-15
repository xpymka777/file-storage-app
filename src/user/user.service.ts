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
    private readonly userRepository: Repository<UserEntity>, // Репозиторий для работы с сущностью UserEntity
    @InjectRepository(FolderEntity)
    private readonly folderRepository: Repository<FolderEntity>, // Репозиторий для работы с сущностью FolderEntity
  ) {}

  async registration(userDto: {
    username: string;
    password: string;
  }): Promise<UserEntity> {
    // Проверка наличия пользователя с таким же именем
    const existingUser = await this.userRepository.findOne({
      where: { username: userDto.username },
    });

    if (existingUser) {
      throw new UnauthorizedException('Имя пользователя занято.');
    }

    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(userDto.password, 10);

    // Создание нового пользователя
    const user = new UserEntity();
    user.username = userDto.username;
    user.password = hashedPassword;

    // Сохранение пользователя в базе данных
    const savedUser = await this.userRepository.save(user);

    // Создание корневой папки для нового пользователя с привязкой к пользователю
    const rootFolder = new FolderEntity();
    rootFolder.name = 'root';
    rootFolder.parentId = null; // корневая папка
    rootFolder.user = savedUser; // связь с пользователем

    // Сохранение корневой папки
    await this.folderRepository.save(rootFolder);

    return savedUser; // Возвращается сохраненный пользователь
  }

  async findOne(username: string): Promise<UserEntity | undefined> {
    // Поиск пользователя по имени пользователя
    return this.userRepository.findOne({
      where: { username },
    });
  }

  async validateUser(
    username: string,
    password: string,
  ): Promise<UserEntity | null> {
    // Поиск пользователя по имени пользователя
    const user = await this.userRepository.findOne({ where: { username } });

    // Проверка пароля
    if (user && (await bcrypt.compare(password, user.password))) {
      return user; // Если пользователь найден и пароль совпадает, возвращается пользователь
    }
    return null; // В противном случае возвращается null
  }
}
