import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { FolderEntity } from '../folder/folder.entity';
import { FileEntity } from '../file/file.entity';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @OneToMany(() => FolderEntity, (folder) => folder.user)
  folders: FolderEntity[];

  @OneToMany(() => FileEntity, (file) => file.user) // Определение отношения OneToMany с FileEntity
  files: FileEntity[]; // Добавление свойства files
}
