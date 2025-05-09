import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. CORS: only allow your Angular dev server (adjust origin for prod)
  app.enableCors({ origin: 'http://localhost:4200' });

  // 2. Global request validation and transformation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,               // Strip properties not in DTOs
      forbidNonWhitelisted: true,    // Throw if extra props are sent
      transform: true,               // Auto-transform payloads to DTO instances
    }),
  );

  // 3. Swagger / OpenAPI generation (available at GET /api-docs)
  const config = new DocumentBuilder()
    .setTitle('Logistics Management API')
    .setDescription('Simplified Logistics System endpoints')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  // 4. Start server
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}`);
}

bootstrap();
