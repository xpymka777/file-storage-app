import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { FolderEntity } from '../folder/folder.entity';
import { UserEntity } from '../user/user.entity';

@Entity()
export class FileEntity {
  @PrimaryGeneratedColumn()
  id: string; // Уникальный идентификатор файла, генерируемый автоматически

  @Column()
  name: string; // Наименование файла

  @Column()
  filepath: string; // Путь к файлу

  @ManyToOne(() => FolderEntity, (folder) => folder.files)
  folder: FolderEntity; // Связь между файлом и папкой, в которой он находится

  @Column()
  folderId: string; // Идентификатор папки, в которой находится файл

  @ManyToOne(() => UserEntity, (user) => user.files) // Определение отношения ManyToOne с UserEntity
  user: UserEntity; // Добавление свойства user
}
