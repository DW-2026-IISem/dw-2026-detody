import dotenv from "dotenv";
import path from "path";
import * as bcrypt from "bcryptjs";
import { Sequelize, QueryTypes } from "sequelize";

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

export async function runAllSeeders(): Promise<void> {
  console.log("🌱 Iniciando SeedersRunner completo...");

  const dialect = (process.env.DB_DIALECT as any) || "mysql";
  const host = process.env.DB_MYSQL_HOST || process.env.DB_HOST || "127.0.0.1";
  const port = Number(process.env.DB_MYSQL_PORT || process.env.DB_PORT) || 3306;
  const username = process.env.DB_MYSQL_USERNAME || process.env.DB_USER || "root";
  const password = process.env.DB_MYSQL_PASSWORD || process.env.DB_PASSWORD || "";
  const database = process.env.DB_MYSQL_NAME || process.env.DB_NAME || "hornoraiz";

  const sequelize = new Sequelize(database, username, password, {
    host,
    port,
    dialect,
    logging: false,
  });

  try {
    await sequelize.authenticate();
    console.log("🔗 Conexión exitosa a la base de datos.");

    // 1. Roles (ADMIN y SELLER)
    let adminRole: any = (await sequelize.query(
      "SELECT id FROM roles WHERE name = 'ADMIN'",
      { type: QueryTypes.SELECT }
    ))[0];

    if (!adminRole) {
      const [id] = await sequelize.query(
        "INSERT INTO roles (name, description, status, createdAt, updatedAt) VALUES ('ADMIN', 'Administrador con acceso total', 'active', NOW(), NOW())"
      );
      adminRole = { id };
    }

    let sellerRole: any = (await sequelize.query(
      "SELECT id FROM roles WHERE name = 'SELLER'",
      { type: QueryTypes.SELECT }
    ))[0];

    if (!sellerRole) {
      const [id] = await sequelize.query(
        "INSERT INTO roles (name, description, status, createdAt, updatedAt) VALUES ('SELLER', 'Vendedor con permisos de ventas y consulta', 'active', NOW(), NOW())"
      );
      sellerRole = { id };
    }

    console.log("✅ Roles confirmados.");

    // 2. Usuarios Canónicos (admin y seller)
    const adminPassword = await bcrypt.hash("Admin123!", 10);
    const sellerPassword = await bcrypt.hash("Seller123!", 10);

    let adminUser: any = (await sequelize.query(
      "SELECT id FROM users WHERE username = 'admin'",
      { type: QueryTypes.SELECT }
    ))[0];

    if (!adminUser) {
      const [id] = await sequelize.query(
        `INSERT INTO users (username, email, password, status, createdAt, updatedAt) VALUES ('admin', 'admin@hornoraiz.com', '${adminPassword}', 'active', NOW(), NOW())`
      );
      adminUser = { id };
    }

    let sellerUser: any = (await sequelize.query(
      "SELECT id FROM users WHERE username = 'seller'",
      { type: QueryTypes.SELECT }
    ))[0];

    if (!sellerUser) {
      const [id] = await sequelize.query(
        `INSERT INTO users (username, email, password, status, createdAt, updatedAt) VALUES ('seller', 'seller@hornoraiz.com', '${sellerPassword}', 'active', NOW(), NOW())`
      );
      sellerUser = { id };
    }

    console.log("✅ Usuarios confirmados.");

    // 3. Tabla pivote role_users
    const adminRoleUser = (await sequelize.query(
      `SELECT 1 FROM role_users WHERE user_id = ${adminUser.id} AND role_id = ${adminRole.id}`,
      { type: QueryTypes.SELECT }
    ))[0];

    if (!adminRoleUser) {
      await sequelize.query(
        `INSERT INTO role_users (user_id, role_id, status, createdAt, updatedAt) VALUES (${adminUser.id}, ${adminRole.id}, 'active', NOW(), NOW())`
      );
    }

    const sellerRoleUser = (await sequelize.query(
      `SELECT 1 FROM role_users WHERE user_id = ${sellerUser.id} AND role_id = ${sellerRole.id}`,
      { type: QueryTypes.SELECT }
    ))[0];

    if (!sellerRoleUser) {
      await sequelize.query(
        `INSERT INTO role_users (user_id, role_id, status, createdAt, updatedAt) VALUES (${sellerUser.id}, ${sellerRole.id}, 'active', NOW(), NOW())`
      );
    }

    console.log("✅ Asignaciones role_users confirmadas.");

    // 4. Recursos del Catálogo API (Endpoints)
    const rawResources = [
      // Sesión y Permisos
      { method: 'GET', path: '/api/sesion/perfil', description: 'Obtener perfil del usuario autenticado', isSeller: true },
      { method: 'GET', path: '/api/permisos', description: 'Obtener lista de permisos efectivos', isSeller: true },

      // Usuarios y Roles
      { method: 'GET', path: '/api/users', description: 'Listar usuarios', isSeller: false },
      { method: 'POST', path: '/api/users', description: 'Crear usuario', isSeller: false },
      { method: 'GET', path: '/api/users/:id', description: 'Detalle usuario', isSeller: false },
      { method: 'PUT', path: '/api/users/:id', description: 'Actualizar usuario', isSeller: false },
      { method: 'DELETE', path: '/api/users/:id', description: 'Eliminar usuario', isSeller: false },

      { method: 'GET', path: '/api/roles', description: 'Listar roles', isSeller: false },
      { method: 'POST', path: '/api/roles', description: 'Crear rol', isSeller: false },
      { method: 'GET', path: '/api/roles/:id', description: 'Detalle rol', isSeller: false },
      { method: 'PUT', path: '/api/roles/:id', description: 'Actualizar rol', isSeller: false },
      { method: 'DELETE', path: '/api/roles/:id', description: 'Eliminar rol', isSeller: false },

      { method: 'GET', path: '/api/resources', description: 'Listar recursos API', isSeller: false },
      { method: 'POST', path: '/api/resources', description: 'Crear recurso API', isSeller: false },
      { method: 'GET', path: '/api/resources/:id', description: 'Detalle recurso API', isSeller: false },
      { method: 'PUT', path: '/api/resources/:id', description: 'Actualizar recurso API', isSeller: false },
      { method: 'PATCH', path: '/api/resources/:id', description: 'Actualizar recurso API (PATCH)', isSeller: false },
      { method: 'PATCH', path: '/api/resources/:id/deactivate', description: 'Desactivar recurso API', isSeller: false },
      { method: 'DELETE', path: '/api/resources/:id', description: 'Eliminar recurso API', isSeller: false },

      { method: 'GET', path: '/api/role-users', description: 'Listar relaciones usuario-rol', isSeller: false },
      { method: 'POST', path: '/api/role-users', description: 'Asignar rol a usuario', isSeller: false },
      { method: 'PATCH', path: '/api/role-users/:id/deactivate', description: 'Retirar rol de usuario', isSeller: false },
      { method: 'DELETE', path: '/api/role-users/:id', description: 'Remover rol de usuario', isSeller: false },

      { method: 'GET', path: '/api/resource-roles', description: 'Listar concesiones RBAC', isSeller: false },
      { method: 'POST', path: '/api/resource-roles', description: 'Crear concesion RBAC', isSeller: false },
      { method: 'PATCH', path: '/api/resource-roles/:id/deactivate', description: 'Revocar concesion RBAC', isSeller: false },
      { method: 'DELETE', path: '/api/resource-roles/:id', description: 'Eliminar concesion RBAC', isSeller: false },

      // Negocio (Clients)
      { method: 'GET', path: '/api/clients', description: 'Listar clientes', isSeller: true },
      { method: 'POST', path: '/api/clients', description: 'Crear cliente', isSeller: true },
      { method: 'GET', path: '/api/clients/:id', description: 'Detalle cliente', isSeller: true },
      { method: 'PUT', path: '/api/clients/:id', description: 'Actualizar cliente', isSeller: false },
      { method: 'PATCH', path: '/api/clients/:id', description: 'Actualizar cliente (PATCH)', isSeller: false },
      { method: 'PATCH', path: '/api/clients/:id/deactivate', description: 'Baja logica cliente', isSeller: false },
      { method: 'DELETE', path: '/api/clients/:id', description: 'Eliminar cliente', isSeller: false },

      // Negocio (Product Types)
      { method: 'GET', path: '/api/product-types', description: 'Listar tipos de productos', isSeller: true },
      { method: 'POST', path: '/api/product-types', description: 'Crear tipo de producto', isSeller: false },
      { method: 'GET', path: '/api/product-types/:id', description: 'Detalle tipo de producto', isSeller: true },
      { method: 'PUT', path: '/api/product-types/:id', description: 'Actualizar tipo de producto', isSeller: false },
      { method: 'PATCH', path: '/api/product-types/:id', description: 'Actualizar tipo de producto (PATCH)', isSeller: false },
      { method: 'PATCH', path: '/api/product-types/:id/deactivate', description: 'Baja logica tipo de producto', isSeller: false },
      { method: 'DELETE', path: '/api/product-types/:id', description: 'Eliminar tipo de producto', isSeller: false },

      // Negocio (Products)
      { method: 'GET', path: '/api/products', description: 'Listar productos', isSeller: true },
      { method: 'POST', path: '/api/products', description: 'Crear producto', isSeller: false },
      { method: 'GET', path: '/api/products/:id', description: 'Detalle producto', isSeller: true },
      { method: 'PUT', path: '/api/products/:id', description: 'Actualizar producto', isSeller: false },
      { method: 'PATCH', path: '/api/products/:id', description: 'Actualizar producto (PATCH)', isSeller: false },
      { method: 'PATCH', path: '/api/products/:id/deactivate', description: 'Baja logica producto', isSeller: false },
      { method: 'DELETE', path: '/api/products/:id', description: 'Eliminar producto', isSeller: false },

      // Negocio (Sales)
      { method: 'GET', path: '/api/sales', description: 'Listar ventas', isSeller: true },
      { method: 'POST', path: '/api/sales', description: 'Registrar venta', isSeller: true },
      { method: 'GET', path: '/api/sales/:id', description: 'Detalle venta', isSeller: true },
      { method: 'PUT', path: '/api/sales/:id', description: 'Actualizar venta', isSeller: false },
      { method: 'PATCH', path: '/api/sales/:id', description: 'Actualizar venta (PATCH)', isSeller: false },
      { method: 'PATCH', path: '/api/sales/:id/deactivate', description: 'Anular venta', isSeller: false },
      { method: 'DELETE', path: '/api/sales/:id', description: 'Anular/Eliminar venta', isSeller: false },

      // Negocio (Product Sales)
      { method: 'GET', path: '/api/product-sales', description: 'Listar detalle de productos por venta', isSeller: true },
      { method: 'POST', path: '/api/product-sales', description: 'Agregar producto a venta', isSeller: true },
      { method: 'GET', path: '/api/product-sales/:id', description: 'Detalle item de venta', isSeller: true },
      { method: 'DELETE', path: '/api/product-sales/:id', description: 'Eliminar item de venta', isSeller: false },
    ];

    let resourceCount = 0;
    let grantCount = 0;

    for (const resData of rawResources) {
      let resRecord: any = (await sequelize.query(
        `SELECT id FROM resources WHERE method = '${resData.method}' AND path = '${resData.path}'`,
        { type: QueryTypes.SELECT }
      ))[0];

      if (!resRecord) {
        const [id] = await sequelize.query(
          `INSERT INTO resources (method, path, description, status, createdAt, updatedAt) VALUES ('${resData.method}', '${resData.path}', '${resData.description}', 'active', NOW(), NOW())`
        );
        resRecord = { id };
        resourceCount++;
      }

      // Concesión para ADMIN
      const adminGrant = (await sequelize.query(
        `SELECT 1 FROM resource_roles WHERE resource_id = ${resRecord.id} AND role_id = ${adminRole.id}`,
        { type: QueryTypes.SELECT }
      ))[0];

      if (!adminGrant) {
        await sequelize.query(
          `INSERT INTO resource_roles (resource_id, role_id, status, createdAt, updatedAt) VALUES (${resRecord.id}, ${adminRole.id}, 'active', NOW(), NOW())`
        );
        grantCount++;
      }

      // Concesión para SELLER (si aplica)
      if (resData.isSeller) {
        const sellerGrant = (await sequelize.query(
          `SELECT 1 FROM resource_roles WHERE resource_id = ${resRecord.id} AND role_id = ${sellerRole.id}`,
          { type: QueryTypes.SELECT }
        ))[0];

        if (!sellerGrant) {
          await sequelize.query(
            `INSERT INTO resource_roles (resource_id, role_id, status, createdAt, updatedAt) VALUES (${resRecord.id}, ${sellerRole.id}, 'active', NOW(), NOW())`
          );
          grantCount++;
        }
      }
    }

    console.log(`✅ Recursos procesados. Nuevos recursos creados: ${resourceCount}`);
    console.log(`✅ Concesiones en resource_roles confirmadas/creadas: ${grantCount}`);
    console.log("🌱 SeedersRunner finalizado exitosamente.");
  } catch (error: any) {
    console.error("❌ Error en la siembra de datos:", error.message);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

if (require.main === module) {
  runAllSeeders();
}
