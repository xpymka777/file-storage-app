import { Controller, Post, Body, Param, Patch, Req } from '@nestjs/common';
import { FolderService } from './folder.service';
import { Request } from 'express';

@Controller('folders')
export class FolderController {
  constructor(private readonly folderService: FolderService) {}

  @Post('/create')
  async createFolder(
    @Req() request: Request,
    @Body('name') name: string,
    @Body('parentId') parentId: string,
  ) {
    if (!request.cookies || typeof request.cookies !== 'object') {
      throw new Error('Куки не найдены в запросе.');
    }
    const userId = request.cookies['userId']; // Получаем userId из куков
    // Проверка на наличие userId в куках или его соответствие
    if (!userId || userId !== request.cookies['userId']) {
      throw new Error(
        'Пользователь не авторизован или у пользователя нет доступа.',
      );
    }
    // Проверка на parentId на null
    if (parentId === null) {
      throw new Error('Укажите родительскую папку.');
    }
    return await this.folderService.createFolder(userId, name, parentId);
  }

  @Patch(':id/rename')
  async editFolderName(
    @Req() request: Request,
    @Param('id') id: string,
    @Body('name') name: string,
  ) {
    if (!request.cookies || typeof request.cookies !== 'object') {
      throw new Error('Куки не найдены в запросе.');
    }
    const userId = request.cookies['userId']; // Получаем userId из куков
    // Проверка на наличие userId в куках или его соответствие
    if (!userId || userId !== request.cookies['userId']) {
      throw new Error(
        'Пользователь не авторизован или у пользователя нет доступа.',
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
    if (!request.cookies || typeof request.cookies !== 'object') {
      throw new Error('Куки не найдены в запросе.');
    }
    const userId = request.cookies['userId']; // Получаем userId из куков
    // Проверка на наличие userId в куках или его соответствие
    if (!userId || userId !== request.cookies['userId']) {
      throw new Error(
        'Пользователь не авторизован или у пользователя нет доступа.',
      );
    }
    // Проверка на установку parentId в null
    if (parentId === null) {
      throw new Error('Нельзя редактировать корневую папку');
    }
    return await this.folderService.moveFolder(id, parentId);
  }
}
