import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { FolderEntity } from '../folder/folder.entity';

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
}
