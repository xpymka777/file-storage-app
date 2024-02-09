import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FolderEntity } from './folder.entity';

@Injectable()
export class FolderService {
  constructor(
    @InjectRepository(FolderEntity)
    private readonly folderRepository: Repository<FolderEntity>,
  ) {}

  async createFolder(
    userId: string,
    name: string,
    parentId: string,
  ): Promise<FolderEntity> {
    const folder = new FolderEntity();
    folder.name = name;
    folder.user = { id: userId } as any;
    folder.parentId = parentId;
    return await this.folderRepository.save(folder);
  }

  async editFolderName(folderId: string, name: string): Promise<FolderEntity> {
    const folder = await this.folderRepository.findOneOrFail({
      where: { id: folderId },
    });
    folder.name = name;
    return await this.folderRepository.save(folder);
  }

  async moveFolder(
    folderId: string,
    newParentId: string,
  ): Promise<FolderEntity> {
    const folder = await this.folderRepository.findOneOrFail({
      where: { id: folderId },
    });
    folder.parentId = newParentId;
    return await this.folderRepository.save(folder);
  }
}
