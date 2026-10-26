import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { writeFileSync } from 'fs';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' }); // /api/v1/...
  app.enableCors(); // the web version will need this
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
  );

  const config = new DocumentBuilder()
    .setTitle('Solstice InterviewApp API')
    .setDescription('Backend for the Solstice Interview Suite')
    .setVersion('0.1.0')
    .addBearerAuth()
    .addTag('System', 'System health and readiness')
    .addTag('Auth', 'Email and password authentication')
    .addTag('Auth: Social sign-in', 'Social provider authentication')
    .addTag('Users', 'User account management')
    .addTag('Career profile', 'Career profile management')
    .addTag('Categories', 'Public category lookup')
    .addTag('Resumes', 'Resume management')
    .addTag('Job descriptions', 'Saved job description management')
    .addTag('Application tracker', 'Application tracking')
    .addTag('Skills audit', 'Skills audit workflows')
    .addTag('Resume/JD matching', 'Resume and job description matching')
    .addTag('Mock interviews', 'Mock interview workflows')
    .addTag('Company lookup', 'Company lookup and insights')
    .addTag('Dashboard', 'Dashboard summaries')
    .addTag('Admin: Question bank', 'Admin question bank management')
    .addTag('Admin: Categories', 'Admin category management')
    .addTag('Admin: Skills audit templates', 'Admin skills audit template management')
    .addTag('Admin: Users and stats', 'Admin users and platform statistics')
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    operationIdFactory: (_controllerKey: string, methodKey: string) => methodKey,
  });
  SwaggerModule.setup('api/docs', app, document);                      // UI at /docs
  writeFileSync('./openapi.json', JSON.stringify(document, null, 2)); // share this with Joel

  await app.listen(3000);
}
void bootstrap();