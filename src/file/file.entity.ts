import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { FolderEntity } from '../folder/folder.entity';
import { UserEntity } from '../user/user.entity';

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

  @Column()
  folderId: string;

  @ManyToOne(() => UserEntity, (user) => user.files) // Определение отношения ManyToOne с UserEntity
  user: UserEntity; // Добавление свойства user
}
