import { Injectable, UnauthorizedException } from '@nestjs/common';
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
        // здесь вы можете добавить проверку на принадлежность папки родителя текущему пользователю
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
}
