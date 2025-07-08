import { Module } from '@nestjs/common';
import { MoviesModule } from './movies/movies.module';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [MoviesModule, UsersModule, DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true, // Hace que las variables de entorno estén disponibles globalmente
      envFilePath: '.env', // Ruta al archivo .env
      ignoreEnvFile: false, // No ignorar el archivo .env
    })
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
