import { Controller, Post, Body, Patch, Param } from '@nestjs/common';
import { FolderService } from './folder.service';

@Controller('folders')
export class FolderController {
  constructor(private readonly folderService: FolderService) {}

  @Post('create')
  async createFolder(@Body() folderDto: { name: string; parentId: string }) {
    // Здесь вы можете добавить вашу логику для получения userId из токена, передаваемого в заголовке запроса
    const userId = '1';
    return this.folderService.createFolder(userId, folderDto);
  }
  @Patch(':id/edit/name')
  async editFolderName(
    @Param('id') folderId: string,
    @Body('name') newName: string,
  ) {
    const updatedFolder = await this.folderService.editFolderName(
      folderId,
      newName,
    );
    return updatedFolder;
  }

  @Patch(':id/edit/parent')
  async moveFolder(
    @Param('id') folderId: string,
    @Body('parentId') newParentId: string,
  ) {
    const updatedFolder = await this.folderService.moveFolder(
      folderId,
      newParentId,
    );
    return updatedFolder;
  }
}
