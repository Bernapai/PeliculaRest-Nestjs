import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configurar ValidationPipe global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina propiedades no definidas en el DTO
      forbidNonWhitelisted: true, // Lanza error si hay propiedades extra
      transform: true, // Transforma payloads a instancias de clases
    }),
  );

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('API Películas')
    .setDescription('API para gestión de películas')
    .setVersion('1.0')
    .addBearerAuth() // Si usás JWT Bearer auth
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  // Escuchar puerto desde .env o 3000 por defecto
  await app.listen(process.env.PORT || 3000);

  console.log(`Server running on http://localhost:${process.env.PORT || 3000}`);
  console.log(
    `Swagger docs available on http://localhost:${process.env.PORT || 3000}/api-docs`,
  );
}

bootstrap().catch((err) => {
  console.error('Error during bootstrap:', err);
});
