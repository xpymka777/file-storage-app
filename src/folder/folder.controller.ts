import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  Req,
  UnauthorizedException,
  NotFoundException,
  Get,
} from '@nestjs/common';
import { FolderService } from './folder.service';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { FolderEntity } from './folder.entity';
import { Repository } from 'typeorm';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Folders')
@Controller('folders')
export class FolderController {
  constructor(
    private readonly folderService: FolderService,
    @InjectRepository(FolderEntity)
    private readonly folderRepository: Repository<FolderEntity>,
  ) {}

  // Метод для создания новой папки
  @Post('/create')
  async createFolder(
    @Req() request: Request,
    @Body('name') name: string,
    @Body('parentId') parentId: string,
  ) {
    const userId = request.cookies['userId'];
    // Проверка авторизации пользователя
    if (!userId || userId !== request.cookies['userId']) {
      throw new UnauthorizedException(
        'Пользователь не авторизован или у пользователя нет доступа.',
      );
    }
    // Проверка наличия parentId
    if (!parentId) {
      throw new NotFoundException('Укажите родительскую папку.');
    }
    // Поиск родительской папки
    const parentFolder = await this.folderRepository.findOne({
      where: { id: parentId, userId },
    });
    // Проверка существования родительской папки
    if (!parentFolder) {
      throw new UnauthorizedException(
        'Родительская папка не принадлежит пользователю.',
      );
    }
    // Создание новой папки через сервис
    return await this.folderService.createFolder(userId, name, parentId);
  }

  // Метод для изменения имени папки
  @Patch(':id/rename')
  async editFolderName(
    @Req() request: Request,
    @Param('id') id: string,
    @Body('name') name: string,
  ) {
    const userId = request.cookies['userId'];
    // Проверка авторизации пользователя
    if (!userId || userId !== request.cookies['userId']) {
      throw new UnauthorizedException(
        'Пользователь не авторизован или у пользователя нет доступа.',
      );
    }

    // Получение папки из репозитория
    const folder = await this.folderRepository.findOne({
      where: { id, userId },
    });

    // Проверка существования папки
    if (!folder) {
      throw new NotFoundException('Папка не найдена.');
    }

    // Проверка изменения названия корневой папки
    if (!folder.parentId && name !== folder.name) {
      throw new UnauthorizedException(
        'Нельзя изменить название корневой папки.',
      );
    }

    // Обновление названия папки
    folder.name = name;
    await this.folderRepository.save(folder);

    return folder;
  }

  // Метод для перемещения папки
  @Patch(':id/move')
  async moveFolder(
    @Req() request: Request,
    @Param('id') id: string,
    @Body('parentId') parentId: string,
  ) {
    const userId = request.cookies['userId'];
    // Проверка авторизации пользователя
    if (!userId || userId !== request.cookies['userId']) {
      throw new UnauthorizedException(
        'Пользователь не авторизован или у пользователя нет доступа.',
      );
    }

    const folder = await this.folderRepository.findOne({
      where: { id, userId },
    });

    // Проверка существования папки
    if (!folder) {
      throw new NotFoundException('Папка не найдена.');
    }

    // Проверка на установку parentId в null
    if (parentId === null) {
      throw new UnauthorizedException('Нельзя переместить корневую папку.');
    }

    // Проверка на перемещение корневой папки в дочернюю
    if (folder.parentId === null && parentId !== folder.id) {
      throw new UnauthorizedException('Нельзя переместить корневую папку.');
    }

    // Обновление родительской папки
    folder.parentId = parentId;
    await this.folderRepository.save(folder);

    return folder;
  }

  // Метод для просмотра папки
  @Get(':id/content')
  async getFolderContent(
    @Param('id') folderId: string,
  ): Promise<FolderEntity | null> {
    return await this.folderService.getFolderContent(folderId);
  }
}
