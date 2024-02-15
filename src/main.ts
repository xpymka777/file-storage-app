import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Используйте cookie-parser
  app.use(cookieParser());
  app.use('/uploads', express.static('uploads'));
  await app.listen(3000);
}

bootstrap();
