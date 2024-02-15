import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FileEntity } from '../file/file.entity';
import { UserEntity } from '../user/user.entity';

@Entity()
export class FolderEntity {
  @PrimaryGeneratedColumn()
  id: string; // Уникальный идентификатор папки, генерируемый автоматически

  @Column()
  name: string; // Наименование папки

  @ManyToOne(() => UserEntity, (user) => user.folders)
  user: UserEntity; // Связь между папкой и пользователем, которому она принадлежит

  @Column({ nullable: true })
  parentId: string; // Идентификатор родительской папки, если есть

  @OneToMany(() => FileEntity, (file) => file.folder)
  files: FileEntity[]; // Связь между папкой и файлами, которые она содержит

  @Column({ nullable: true })
  userId: string; // Идентификатор пользователя, которому принадлежит папка
}
