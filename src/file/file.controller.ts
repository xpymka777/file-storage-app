import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Req,
  Delete,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { FileService } from './file.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';

@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Req() request: Request,
  ): Promise<any> {
    const userId = request.cookies['userId'];
    const { folderId } = request.body;

    return this.fileService.uploadFile(file, folderId, userId);
  }

  @Delete('delete/:fileId')
  async deleteFile(@Param('fileId') fileId: string): Promise<any> {
    const deletedFile = await this.fileService.deleteFile(fileId);
    if (!deletedFile) {
      throw new NotFoundException('Файл не найден');
    }
    return { message: 'Файл успешно удален' };
  }
}
