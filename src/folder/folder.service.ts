import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FolderEntity } from './folder.entity';
import { UserEntity } from '../user/user.entity';

@Injectable()
export class FolderService {
  constructor(
    @InjectRepository(FolderEntity)
    private readonly folderRepository: Repository<FolderEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  // Метод для создания новой папки
  async createFolder(
    userId: string,
    name: string,
    parentId: string,
  ): Promise<FolderEntity> {
    const folder = new FolderEntity();
    folder.name = name;

    // Получение пользователя по userId
    const user = await this.userRepository.findOne({
      where: { id: Number(userId) },
    });

    if (!user) {
      throw new Error('Пользователь не найден');
    }

    folder.user = user; // Установка свойства "user"
    folder.parentId = parentId;
    return await this.folderRepository.save(folder);
  }

  // Метод для изменения имени папки
  async editFolderName(folderId: string, name: string): Promise<FolderEntity> {
    const folder = await this.folderRepository.findOneOrFail({
      where: { id: folderId },
    });
    folder.name = name;
    return await this.folderRepository.save(folder);
  }

  // Метод для перемещения папки
  async moveFolder(
    folderId: string,
    newParentId: string,
  ): Promise<FolderEntity> {
    const folder = await this.folderRepository.findOneOrFail({
      where: { id: folderId },
    });
    folder.parentId = newParentId;
    return await this.folderRepository.save(folder);
  }

  // Метод для получения содержимого папки
  async getFolderContent(folderId: string): Promise<FolderEntity | null> {
    return await this.folderRepository.findOne({
      where: { id: folderId },
      relations: ['files', 'user.folders'], // Включение связанных данных для запроса
    });
  }
}
