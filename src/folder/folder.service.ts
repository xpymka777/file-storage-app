import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FolderEntity } from './folder.entity';

@Injectable()
export class FolderService {
  constructor(
    @InjectRepository(FolderEntity)
    private readonly folderRepository: Repository<FolderEntity>,
  ) {}

  async createFolder(
    userId: string,
    folderDto: {
      name: string;
      parentId: string;
    },
  ): Promise<FolderEntity> {
    // Получаем папку родителя
    const parentFolder = await this.folderRepository.findOne({
      where: {
        id: folderDto.parentId,
      },
    });

    // Проверяем, что папка родитель существует
    if (!parentFolder) {
      throw new UnauthorizedException('Родительская папка не найдена.');
    }

    // Создаем новую папку
    const newFolder = new FolderEntity();
    newFolder.name = folderDto.name;
    newFolder.parentId = parentFolder.id; // Устанавливаем родительскую папку

    // Сохраняем папку
    return this.folderRepository.save(newFolder);
  }

  async getFolderById(folderId: string): Promise<FolderEntity> {
    const folder = await this.folderRepository.findOne({
      where: { id: folderId },
    });

    if (!folder) {
      throw new NotFoundException('Папка не найдена.');
    }

    return folder;
  }

  async editFolderName(
    folderId: string,
    newName: string,
  ): Promise<FolderEntity> {
    const folder = await this.getFolderById(folderId);

    // Проверка, является ли папка root
    if (folder.parentId === null) {
      throw new UnauthorizedException('Переименование root папки запрещено.');
    }

    // Обновление названия папки
    folder.name = newName;

    // Сохранение изменений
    return this.folderRepository.save(folder);
  }

  async moveFolder(
    folderId: string,
    newParentId: string,
  ): Promise<FolderEntity> {
    const folder = await this.getFolderById(folderId);

    // Получение новой родительской папки
    const newParentFolder = await this.getFolderById(newParentId);

    // Проверка, существует ли новая родительская папка
    if (!newParentFolder) {
      throw new NotFoundException('Новая родительская папка не найдена.');
    }

    // Проверка, является ли папка root
    if (folder.parentId === null) {
      throw new UnauthorizedException('Перемещение root папки запрещено.');
    }

    // Установка новой родительской папки
    folder.parentId = newParentFolder.id;

    // Сохранение изменений
    return this.folderRepository.save(folder);
  }
}
