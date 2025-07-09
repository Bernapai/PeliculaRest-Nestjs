import { DataSource } from 'typeorm';
import { User, UserRole } from '../../users/entities/user.entity';
import { Pelicula } from '../../movies/entities/movie.entity';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';


async function seed() {
  // 0. Crear Nuevo Contexto y Llamar al Servicio
  const app = await NestFactory.createApplicationContext(AppModule);
  const configService = app.get(ConfigService);


  // 1. Crear una conexión a la base de datos (DataSource)
  const dataSource = new DataSource({
    type: 'postgres',
    host: configService.get<string>('DB_HOST'),
    port: configService.get<number>('DB_PORT'),
    username: configService.get<string>('DB_USERNAME'),
    password: configService.get<string>('DB_PASSWORD'),
    database: configService.get<string>('DB_NAME'),
    entities: [Pelicula, User],
    synchronize: true,
  });

  // 2. Inicializar la conexión
  await dataSource.initialize();

  // 3. Obtener los repositorios para cada entidad (tablas)
  const peliculaRepo = dataSource.getRepository(Pelicula);
  const usuarioRepo = dataSource.getRepository(User);

  // 4. Crear instancias de las entidades (datos nuevos)
  const pelicula1 = peliculaRepo.create({
    titulo: 'El Gran Escape',
    descripcion: 'Película clásica de acción',
    anio: 1963,
    genero: 'Acción',
    calificacion: 8.2,
  });

  const pelicula2 = peliculaRepo.create({
    titulo: 'Inception',
    descripcion: 'Sueños dentro de sueños',
    anio: 2010,
    genero: 'Ciencia ficción',
    calificacion: 8.8,
  });

  // 5. Lo mismo con usuarios
  const adminUser = usuarioRepo.create({
    name: 'Admin',
    password: 'password',
    role: UserRole.ADMIN,
  });

  const normalUser = usuarioRepo.create({
    name: 'User',
    password: 'hashedpassword',
    role: UserRole.USER,
  });

  // 6. Guardar los datos en la base
  await peliculaRepo.save([pelicula1, pelicula2]);
  await usuarioRepo.save([adminUser, normalUser]);

  // 7. Cerrar la conexión cuando terminás
  await dataSource.destroy();
  await app.close(); //  Cerrar el contexto Nest

  console.log('Seed finalizado con éxito');
}

// Ejecutar la función y atrapar errores
seed().catch((error) => {
  console.error('Error en seed:', error);
  process.exit(1);
});
