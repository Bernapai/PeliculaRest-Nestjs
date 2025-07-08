import { DataSource } from 'typeorm';
import { Usuario, UserRole } from 'src/users/entities/user.entity';
import { Pelicula } from 'src/movies/entities/movie.entity';

async function seed() {
  // 1. Crear una conexión a la base de datos (DataSource)
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'moviesDB',
    entities: [Pelicula, Usuario],
    synchronize: true,
  });

  // 2. Inicializar la conexión
  await dataSource.initialize();

  // 3. Obtener los repositorios para cada entidad (tablas)
  const peliculaRepo = dataSource.getRepository(Pelicula);
  const usuarioRepo = dataSource.getRepository(Usuario);

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
    nombre: 'Admin',
    password: 'password',
    role: UserRole.ADMIN,
  });

  const normalUser = usuarioRepo.create({
    nombre: 'User',
    password: 'hashedpassword',
    role: UserRole.USER,
  });

  // 6. Guardar los datos en la base
  await peliculaRepo.save([pelicula1, pelicula2]);
  await usuarioRepo.save([adminUser, normalUser]);

  // 7. Cerrar la conexión cuando terminás
  await dataSource.destroy();

  console.log('Seed finalizado');
}

// Ejecutar la función y atrapar errores
seed().catch((error) => {
  console.error('Error en seed:', error);
  process.exit(1);
});
