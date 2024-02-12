import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { UserEntity } from './user/user.entity';
import { FolderEntity } from './folder/folder.entity';
import { FileEntity } from './file/file.entity';

import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { FolderController } from './folder/folder.controller';
import { FolderService } from './folder/folder.service';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'root',
      database: 'file-service',
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([UserEntity, FolderEntity, FileEntity]),
    JwtModule.register({
      secret: '123321',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [UserController, FolderController],
  providers: [UserService, FolderService],
})
export class AppModule {}
