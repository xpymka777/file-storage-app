import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class FolderEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  parentId: string;
}
