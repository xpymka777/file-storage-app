import { Injectable, UploadedFile } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileEntity } from './file.entity';
import { FolderEntity } from '../folder/folder.entity';
import { createWriteStream, mkdirSync, existsSync, unlinkSync } from 'fs';
import * as path from 'path';
import { UserEntity } from '../user/user.entity';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
    @InjectRepository(FolderEntity)
    private readonly folderRepository: Repository<FolderEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    folderId: string,
    userId: string,
  ): Promise<FileEntity> {
    // Получение объекта папки из репозитория
    const folder = await this.folderRepository.findOne({
      where: { id: folderId },
    });
    // Проверка наличия папки
    if (!folder) {
      throw new Error('Укажите папку');
    }
    // Получение объекта пользователя из репозитория
    const user = await this.userRepository.findOne({
      where: { id: Number(userId) },
    });
    // Проверка авторизации пользователя
    if (!user) {
      throw new Error('Не авторизован!');
    }
    // Создание папки для загрузок, если её нет
    const uploadsFolder = path.join(process.cwd(), 'uploads');
    if (!existsSync(uploadsFolder)) {
      mkdirSync(uploadsFolder);
    }
    // Генерация уникального имени файла на основе времени и оригинального имени
    const fileName = `${Date.now()}-${file.originalname}`;
    // Формирование пути к файлу
    const newFilePath = `uploads/${fileName}`;
    // Создание потока для записи файла
    const fileWriteStream = createWriteStream(
      path.join(process.cwd(), newFilePath),
    );
    // Запись данных файла
    fileWriteStream.write(file.buffer);
    // Создание частичного объекта FileEntity для сохранения в базу данных
    const newFile: Partial<FileEntity> = {
      name: file.originalname,
      filepath: newFilePath,
      folder: folder,
      folderId: folder.id,
      user: user,
    };
    // Сохранение нового файла в базе данных
    return this.fileRepository.save(newFile);
  }

  async deleteFile(fileId: string): Promise<FileEntity | null> {
    // Поиск файла в базе данных по идентификатору
    const file = await this.fileRepository.findOne({ where: { id: fileId } });

    // Проверка наличия файла
    if (!file) {
      return null;
    }

    try {
      // Удаление файла с сервера
      const filePath = path.join(process.cwd(), file.filepath);
      unlinkSync(filePath);

      // Удаление файла из базы данных
      await this.fileRepository.remove(file);

      return file;
    } catch (error) {
      console.error('Ошибка при удалении файла:', error);
      throw new Error('Ошибка при удалении файла');
    }
  }
}
