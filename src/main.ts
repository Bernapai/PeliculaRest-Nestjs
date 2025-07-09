import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { setupSwagger, logSwaggerUrl } from './common/swagger.config';
import { GlobalValidationPipe } from './common/pipes/validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const validationPipe = app.get(GlobalValidationPipe);

  // Configurar pipe global
  app.useGlobalPipes(validationPipe);

  // Configurar Swagger
  setupSwagger(app);

  // Obtener puerto desde configuración
  const port = configService.get<number>('PORT', 3000);

  await app.listen(port);

  console.log(`Server running on http://localhost:${port}`);
  logSwaggerUrl(port);
}

bootstrap().catch((err) => {
  console.error('Error during bootstrap:', err);
  process.exit(1);
});