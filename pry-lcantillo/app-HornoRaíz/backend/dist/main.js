"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const app_module_js_1 = require("./app.module.js");
const global_exception_filter_js_1 = require("./common/filters/global-exception.filter.js");
const response_interceptor_js_1 = require("./common/interceptors/response.interceptor.js");
const main_seeder_js_1 = require("./infrastructure/database/sequelize/seeders/main.seeder.js");
async function bootstrap() {
    const logger = new common_1.Logger('Bootstrap');
    const app = await core_1.NestFactory.create(app_module_js_1.AppModule);
    app.setGlobalPrefix('api');
    app.enableCors();
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true, transform: true }));
    app.useGlobalFilters(new global_exception_filter_js_1.GlobalExceptionFilter());
    app.useGlobalInterceptors(new response_interceptor_js_1.ResponseInterceptor());
    const config = new swagger_1.DocumentBuilder()
        .setTitle('HornoRaíz API')
        .setDescription('Backend modular de gestión para HornoRaíz basado en Clean Architecture y NestJS')
        .setVersion('1.0.0')
        .addTag('clients', 'Gestión de clientes')
        .addTag('product-types', 'Categorías y tipos de productos')
        .addTag('products', 'Catálogo e inventario de productos')
        .addTag('sales', 'Procesamiento de ventas e historial')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    if (process.env.NODE_ENV !== 'production') {
        const seeder = app.get(main_seeder_js_1.MainSeeder);
        await seeder.run();
    }
    const port = process.env.PORT ?? 3004;
    await app.listen(port);
    logger.log(`Servidor HornoRaíz corriendo exitosamente en el puerto ${port}`);
    logger.log(`Documentación Swagger disponible en: http://localhost:${port}/api/docs`);
}
bootstrap();
//# sourceMappingURL=main.js.map