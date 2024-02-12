import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  Req,
  UnauthorizedException,
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
    @InjectRepository(FolderEntity) // Внедряем FolderEntity
    private readonly folderRepository: Repository<FolderEntity>, // Внедряем Repository<FolderEntity>
  ) {}

  @Post('/create')
  async createFolder(
    @Req() request: Request,
    @Body('name') name: string,
    @Body('parentId') parentId: string,
  ) {
    const userId = request.cookies['userId']; // Получаем userId из куков
    // Проверка на наличие userId в куках или его соответствие
    if (!userId || userId !== request.cookies['userId']) {
      throw new Error(
        'Пользователь не авторизован или у пользователя нет доступа.',
      );
    }
    const parentFolder = await this.folderRepository.findOne({
      where: { id: parentId, userId },
    });
    if (!parentFolder) {
      throw new UnauthorizedException(
        'Родительская папка не принадлежит пользователю.',
      );
    }
    // Проверка parentId на null
    if (!parentId) {
      throw new Error('Укажите родительскую папку.');
    }
    // Создание папки
    return await this.folderService.createFolder(userId, name, parentId);
  }

  @Patch(':id/rename')
  async editFolderName(
    @Req() request: Request,
    @Param('id') id: string,
    @Body('name') name: string,
  ) {
    const userId = request.cookies['userId']; // Получаем userId из куков
    // Проверка на наличие userId в куках или его соответствие
    if (!userId || userId !== request.cookies['userId']) {
      throw new Error(
        'Пользователь не авторизован или у пользователя нет доступа.',
      );
    }
    const folder = await this.folderRepository.findOneOrFail({ where: { id } });

    if (folder.userId !== userId) {
      throw new Error(
        'У вас нет разрешения на выполнение этого действия для указанной папки.',
      );
    }
    // Проверка на изменение названия root папки
    if (id === 'rootFolderId') {
      throw new Error('Нельзя изменить корневую папку.');
    }
    return await this.folderService.editFolderName(id, name);
  }

  @Patch(':id/move')
  async moveFolder(
    @Req() request: Request,
    @Param('id') id: string,
    @Body('parentId') parentId: string,
  ) {
    const userId = request.cookies['userId']; // Получаем userId из куков
    // Проверка на наличие userId в куках или его соответствие
    if (!userId || userId !== request.cookies['userId']) {
      throw new Error(
        'Пользователь не авторизован или у пользователя нет доступа.',
      );
    }
    const folder = await this.folderRepository.findOneOrFail({ where: { id } });

    if (folder.userId !== userId) {
      throw new Error(
        'У вас нет разрешения на выполнение этого действия для указанной папки.',
      );
    }
    // Проверка на установку parentId в null
    if (parentId === null) {
      throw new Error('Нельзя редактировать корневую папку');
    }
    return await this.folderService.moveFolder(id, parentId);
  }
}
