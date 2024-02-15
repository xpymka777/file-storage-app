// import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { JwtModule } from '@nestjs/jwt';
//
// import { UserEntity } from './user/user.entity';
// import { FolderEntity } from './folder/folder.entity';
// import { FileEntity } from './file/file.entity';
//
// import { UserController } from './user/user.controller';
// import { UserService } from './user/user.service';
// import { FolderController } from './folder/folder.controller';
// import { FolderService } from './folder/folder.service';
// import { FileController } from './file/file.controller';
// import { FileService } from './file/file.service';
//
// @Module({
//   imports: [
//     //конфиг для подключения к бд
//     TypeOrmModule.forRoot({
//       type: 'postgres',
//       host: 'localhost',
//       port: 5432,
//       username: 'postgres',
//       password: 'root',
//       database: 'file-service',
//       entities: [UserEntity, FolderEntity, FileEntity],
//       synchronize: true,
//     }),
//     TypeOrmModule.forFeature([UserEntity, FolderEntity, FileEntity]),
//     //для jwt токена устанавливаем ключ генерации и время жизни
//     JwtModule.register({
//       secret: '123321',
//       signOptions: { expiresIn: '1h' },
//     }),
//   ],
//   //подключаем контроллеры и сервисы для работы в приложении
//   controllers: [UserController, FolderController, FileController],
//   providers: [UserService, FolderService, FileService],
// })
// export class AppModule {
//   // Метод configure позволяет добавить middleware для обработки CORS запросов
//   configure(consumer: MiddlewareConsumer) {
//     consumer
//       // Применяем middleware Express для обработки CORS запросов
//       .apply((req, res, next) => {
//         // Устанавливаем заголовки для разрешения CORS
//         res.header('Access-Control-Allow-Origin', '*'); // Разрешаем доступ с любого домена
//         res.header(
//           'Access-Control-Allow-Headers',
//           'Origin, X-Requested-With, Content-Type, Accept', // Указываем разрешенные заголовки
//         );
//         if (req.method === 'OPTIONS') {
//           // Если метод OPTIONS, то возвращаем разрешенные методы
//           res.header(
//             'Access-Control-Allow-Methods',
//             'GET, POST, PATCH, DELETE',
//           );
//           return res.status(200).json({}); // Возвращаем успешный статус
//         }
//         next(); // Передаем управление следующему middleware
//       })
//       .forRoutes({ path: '*', method: RequestMethod.ALL }); // Обрабатываем CORS запросы для всех маршрутов и методов
//   }
// }
//
import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'; // Импорт модулей, связанных с Swagger

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
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'root',
      database: 'file-service',
      entities: [UserEntity, FolderEntity, FileEntity],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([UserEntity, FolderEntity, FileEntity]),
    JwtModule.register({
      secret: '123321',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [UserController, FolderController, FileController],
  providers: [UserService, FolderService, FileService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply((req, res, next) => {
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
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }

  // Добавьте метод для настройки Swagger
  static async setupSwagger(app) {
    const options = new DocumentBuilder()
      .setTitle('Файловое хранилище')
      .setDescription('Небольшое файловое хранилище')
      .setVersion('1.0')
      .addTag('API')
      .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api/', app, document);
  }
}