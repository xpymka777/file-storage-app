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
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => UserEntity, (user) => user.folders)
  user: UserEntity;

  @Column({ nullable: true })
  parentId: string;

  @OneToMany(() => FileEntity, (file) => file.folder)
  files: FileEntity[];
}
