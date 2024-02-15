import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { FolderEntity } from '../folder/folder.entity';
import { FileEntity } from '../file/file.entity';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number; // Уникальный идентификатор пользователя, генерируемый автоматически

  @Column()
  username: string; // Имя пользователя

  @Column()
  password: string; // Пароль пользователя

  @OneToMany(() => FolderEntity, (folder) => folder.user)
  folders: FolderEntity[]; // Связь между пользователем и папками, которые ему принадлежат

  @OneToMany(() => FileEntity, (file) => file.user)
  files: FileEntity[]; // Связь между пользователем и файлами, которые им созданы или принадлежат ему
}
