import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { UserEntity } from './user/user.entity';
import { FolderEntity } from './folder/folder.entity';
import { FileEntity } from './file/file.entity';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { FolderController } from './folder/folder.controller';
import { FolderService } from './folder/folder.service';
import { FileController } from './file/file.controller';
import { FileService } from './file/file.service';

@Module({
  imports: [
    // Конфигурация модуля Nest.js
    TypeOrmModule.forRoot({
      // Конфигурация подключения к базе данных PostgreSQL
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'root',
      database: 'file-service',
      // Загрузка сущностей (UserEntity, FolderEntity, FileEntity) для использования в приложении
      entities: [UserEntity, FolderEntity, FileEntity],
      synchronize: true, // Синхронизация моделей с базой данных
    }),
    TypeOrmModule.forFeature([UserEntity, FolderEntity, FileEntity]), // Регистрация сущностей для использования в репозиториях
    JwtModule.register({
      // Конфигурация модуля JWT для аутентификации и авторизации
      secret: '123321', // Секретный ключ для подписи токенов
      signOptions: { expiresIn: '1h' }, // Время жизни токенов (1 час)
    }),
  ],
  // Контроллеры и сервисы, используемые в приложении
  controllers: [UserController, FolderController, FileController],
  providers: [UserService, FolderService, FileService],
})
export class AppModule {
  // Метод configure для конфигурации middleware
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply((req, res, next) => {
        // Middleware для обработки CORS
        res.header('Access-Control-Allow-Origin', '*');
        res.header(
          'Access-Control-Allow-Headers',
          'Origin, X-Requested-With, Content-Type, Accept',
        );
        if (req.method === 'OPTIONS') {
          res.header(
            'Access-Control-Allow-Methods',
            'GET, POST, PATCH, DELETE',
          );
          return res.status(200).json({});
        }
        next();
      })
      .forRoutes({ path: '*', method: RequestMethod.ALL }); // Применение middleware ко всем маршрутам
  }

  // Метод для настройки Swagger
  static async setupSwagger(app) {
    const options = new DocumentBuilder()
      .setTitle('Файловое хранилище') // Заголовок документации
      .setDescription('Небольшое файловое хранилище') // Описание API
      .setVersion('1.0') // Версия API
      .addTag('API') // Добавление тега для API
      .build();
    const document = SwaggerModule.createDocument(app, options); // Создание документации Swagger
    SwaggerModule.setup('api/', app, document); // Настройка Swagger на /api/
  }
}
