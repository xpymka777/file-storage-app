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
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Files')
@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  // Объявление контроллера для обработки запросов, связанных с файлами

  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File, // Асинхронный метод для загрузки файла
    @Req() request: Request,
  ): Promise<any> {
    // Извлечение идентификатора пользователя и id папки из запроса
    const userId = request.cookies['userId'];
    const { folderId } = request.body;

    // Вызов сервиса для обработки загрузки файла
    return this.fileService.uploadFile(file, folderId, userId);
  }

  // Объявление контроллера для обработки запроса на удаление файла

  @Delete('delete/:fileId')
  async deleteFile(@Param('fileId') fileId: string): Promise<any> {
    // Вызов сервиса для удаления файла по его идентификатору
    const deletedFile = await this.fileService.deleteFile(fileId);

    // Проверка, был ли файл успешно удален, иначе выбросить исключение NotFoundException
    if (!deletedFile) {
      throw new NotFoundException('Файл не найден');
    }

    // Возврат сообщения об успешном удалении файла
    return { message: 'Файл успешно удален' };
  }
}
