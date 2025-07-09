import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication): void {
    const config = new DocumentBuilder()
        .setTitle('API Películas')
        .setDescription('API para gestión de películas')
        .setVersion('1.0')
        .addBearerAuth()
        .addTag('movies', 'Operaciones con películas')
        .addTag('users', 'Operaciones con usuarios')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document);
}

export function logSwaggerUrl(port: number): void {
    console.log(`Swagger docs available on http://localhost:${port}/api-docs`);
}
