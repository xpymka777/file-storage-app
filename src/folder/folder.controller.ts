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

@Controller('folders')
export class FolderController {
  constructor(
    private readonly folderService: FolderService,
    @InjectRepository(FolderEntity)
    private readonly folderRepository: Repository<FolderEntity>,
  ) {}

  @Post('/create')
  async createFolder(
    @Req() request: Request,
    @Body('name') name: string,
    @Body('parentId') parentId: string,
  ) {
    const userId = request.cookies['userId'];
    if (!userId || userId !== request.cookies['userId']) {
      throw new UnauthorizedException(
        'Пользователь не авторизован или у пользователя нет доступа.',
      );
    }
    if (!parentId) {
      throw new NotFoundException('Укажите родительскую папку.');
    }
    const parentFolder = await this.folderRepository.findOne({
      where: { id: parentId, userId },
    });
    if (!parentFolder) {
      throw new UnauthorizedException(
        'Родительская папка не принадлежит пользователю.',
      );
    }
    return await this.folderService.createFolder(userId, name, parentId);
  }

  @Patch(':id/rename')
  async editFolderName(
    @Req() request: Request,
    @Param('id') id: string,
    @Body('name') name: string,
  ) {
    const userId = request.cookies['userId'];
    if (!userId || userId !== request.cookies['userId']) {
      throw new UnauthorizedException(
        'Пользователь не авторизован или у пользователя нет доступа.',
      );
    }

    // Получение папки из репозитория
    const folder = await this.folderRepository.findOne({
      where: { id, userId },
    });

    if (!folder) {
      throw new NotFoundException('Папка не найдена.');
    }

    // Проверка на изменение названия корневой папки
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

  @Patch(':id/move')
  async moveFolder(
    @Req() request: Request,
    @Param('id') id: string,
    @Body('parentId') parentId: string,
  ) {
    const userId = request.cookies['userId'];
    if (!userId || userId !== request.cookies['userId']) {
      throw new UnauthorizedException(
        'Пользователь не авторизован или у пользователя нет доступа.',
      );
    }

    const folder = await this.folderRepository.findOne({
      where: { id, userId },
    });

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

  @Get(':id/content')
  async getFolderContent(
    @Param('id') folderId: string,
  ): Promise<FolderEntity | null> {
    return await this.folderService.getFolderContent(folderId);
  }
}
