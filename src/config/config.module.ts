import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { validationSchema } from './validation.schema';

@Module({
    imports: [
        NestConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
            ignoreEnvFile: false,
            validationSchema, // Validación de variables de entorno
        }),
    ],
    exports: [NestConfigModule],
})
export class ConfigModule { }