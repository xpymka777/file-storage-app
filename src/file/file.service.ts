import { Injectable, UploadedFile } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileEntity } from './file.entity';
import { FolderEntity } from '../folder/folder.entity';
import { createWriteStream, mkdirSync, existsSync } from 'fs';
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
    const folder = await this.folderRepository.findOne({
      where: { id: folderId },
    });
    if (!folder) {
      throw new Error('Укажите папку');
    }
    const user = await this.userRepository.findOne({
      where: { id: Number(userId) },
    });
    if (!user) {
      throw new Error('Не авторизован!');
    }
    const uploadsFolder = path.join(process.cwd(), 'uploads');
    if (!existsSync(uploadsFolder)) {
      mkdirSync(uploadsFolder);
    }
    const fileName = `${Date.now()}-${file.originalname}`;
    const newFilePath = `uploads/${fileName}`;
    const fileWriteStream = createWriteStream(
      path.join(process.cwd(), newFilePath),
    );
    fileWriteStream.write(file.buffer);
    const newFile: Partial<FileEntity> = {
      name: file.originalname,
      filepath: newFilePath,
      folder: folder,
      folderId: folder.id,
      user: user,
    };
    return this.fileRepository.save(newFile);
  }
}
