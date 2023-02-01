import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { AppModule } from './app.module';
import 'dotenv/config';
import { parse } from 'yaml';

const PORT = process.env.PORT || 4000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const apiSchema = await readFile(
    join(__dirname, '..', 'doc/api.yaml'),
    'utf-8',
  );

  SwaggerModule.setup('api', app, parse(apiSchema));

  await app.listen(PORT);
}
bootstrap();
