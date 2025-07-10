# Proyecto de Gestión de Películas
Este proyecto es una aplicación desarrollada con el framework **NestJS** diseñada para gestionar películas y sus datos asociados. Implementa una arquitectura modular que incluye integración con **PostgreSQL** como base de datos y **TypeORM** como ORM, proporcionando una API robusta y bien documentada para interactuar con los datos.

---

## 🚀 Guía para Ejecutar en Desarrollo

### Pasos iniciales:

1. **Clonar el repositorio:**
   ```bash
   git clone <url-del-repositorio>
   ```

2. **Instalar las dependencias:**
   ```bash
   npm install
   ```

3. **Instalar Nest CLI:**
   ```bash
   npm i -g @nestjs/cli
   ```

4. **Configurar el archivo de entorno:**
   - Modifica las variables del archivo `.env.template` según tu configuración local.
   - Elimina la extensión `.template` del archivo para que quede como `.env`.

5. **Levantar la base de datos:**
   ```bash
   docker-compose up -d
   ```
   > Este comando iniciará un contenedor con PostgreSQL utilizando la configuración de `docker-compose`.

6. **Iniciar el servidor en modo desarrollo:**
   ```bash
   npm run start:dev
   ```

7. **Poblar la base de datos con datos de semilla:**
   ```bash
   npm run seed
   ```

---

## 🛠️ Documentación de Endpoints

La documentación de los endpoints está disponible en formato Swagger. Accede a ella desde:
```
http://localhost:3000/api#/
```

## 🧪 Ejecutar Tests

Para ejecutar los tests unitarios y de integración, usa el siguiente comando:
```bash
npm run test
```

---

## 🛠️ Stack Tecnológico

- **NestJS**: Framework para Node.js.
- **TypeScript**: Lenguaje de programación tipado.
- **PostgreSQL**: Base de datos relacional.
- **TypeORM**: ORM para gestionar las entidades y migraciones.