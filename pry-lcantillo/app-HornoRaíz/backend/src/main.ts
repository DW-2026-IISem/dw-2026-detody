import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module.js';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter.js';
import { ResponseInterceptor } from './common/interceptors/response.interceptor.js';
import { MainSeeder } from './infrastructure/database/sequelize/seeders/main.seeder.js';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.enableCors();

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Configuración de OpenAPI / Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('HornoRaíz API')
    .setDescription('Backend modular de gestión para HornoRaíz basado en Clean Architecture y NestJS')
    .setVersion('1.0.0')
    .addTag('clients', 'Gestión de clientes')
    .addTag('product-types', 'Categorías y tipos de productos')
    .addTag('products', 'Catálogo e inventario de productos')
    .addTag('sales', 'Procesamiento de ventas e historial')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Ejecución de Seeders en entorno de desarrollo
  if (process.env.NODE_ENV !== 'production') {
    const seeder = app.get(MainSeeder);
    await seeder.run();
  }

  const port = process.env.PORT ?? 3004;
  await app.listen(port);
  logger.log(`Servidor HornoRaíz corriendo exitosamente en el puerto ${port}`);
  logger.log(`Documentación Swagger disponible en: http://localhost:${port}/api/docs`);
}
await bootstrap();
