import { Module } from '@nestjs/common';
import { MoviesModule } from './movies/movies.module';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from './config/config.module';
import { PipesModule } from './common/pipes/pipes.module';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    PipesModule,
    MoviesModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }