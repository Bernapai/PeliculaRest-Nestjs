// 2. src/config/validation.schema.ts
import * as Joi from 'joi';

export const validationSchema = Joi.object({
    // Puerto de la app
    PORT: Joi.number().default(3000),

    // Base de datos
    DB_HOST: Joi.string().required(),
    DB_PORT: Joi.number().default(5432),
    DB_USERNAME: Joi.string().required(),
    DB_PASSWORD: Joi.string().required(),
    DB_NAME: Joi.string().required(),

    // JWT
    JWT_SECRET: Joi.string().min(10).required(),
    JWT_EXPIRATION: Joi.string().default('3600s'),

});