import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import * as compression from 'compression';
import * as helmet from 'helmet';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app
    .use(helmet())
    .use(compression())
    .enableCors();

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true
  }))

  app.setGlobalPrefix('api');

  const options = new DocumentBuilder()
    .setTitle('Boilerplate')
    .setDescription('Boilerplate application')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3000);
}
bootstrap();
