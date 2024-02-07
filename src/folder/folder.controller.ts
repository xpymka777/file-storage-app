import { Controller, Post, Body } from '@nestjs/common';
import { FolderService } from './folder.service';

@Controller('folders')
export class FolderController {
  constructor(private readonly folderService: FolderService) {}

  @Post('create')
  async createFolder(@Body() folderDto: { name: string; parentId: string }) {
    // Здесь вы можете добавить вашу логику для получения userId из токена, передаваемого в заголовке запроса
    const userId = 'exampleUserId';
    return this.folderService.createFolder(userId, folderDto);
  }
}
