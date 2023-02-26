import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { readFile } from 'fs/promises';
import { resolve } from 'path';
import { AppModule } from './app.module';
import 'dotenv/config';
import { parse } from 'yaml';
import { ValidationPipe } from '@nestjs/common';
import { LoggingService } from './logger/logging.service';
import { HttpExceptionFilter } from './logger/http-exception.filter';

const PORT = process.env.PORT || 4000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new LoggingService(),
  });
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const apiSchema = await readFile(
    resolve(process.cwd(), 'doc', 'api.yaml'),
    'utf-8',
  );

  SwaggerModule.setup('doc', app, parse(apiSchema));

  const logger = new LoggingService();
  app.useGlobalFilters(new HttpExceptionFilter(logger));

  await app.listen(PORT, () => console.log(`Server works on port ${PORT}`));
}
bootstrap();
