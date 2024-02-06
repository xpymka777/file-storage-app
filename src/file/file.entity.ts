import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { FolderEntity } from '../folder/folder.entity';

@Entity()
export class FileEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  filepath: string;

  @ManyToOne(() => FolderEntity, (folder) => folder.files)
  folder: FolderEntity;
}
