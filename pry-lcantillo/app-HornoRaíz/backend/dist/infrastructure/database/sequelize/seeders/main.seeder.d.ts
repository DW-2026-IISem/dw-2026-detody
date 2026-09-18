import { ClientSeeder } from '../../../../features/business/clients/infrastructure/persistence/seeders/client.seeder.js';
import { ProductTypeSeeder } from '../../../../features/business/product-types/infrastructure/persistence/seeders/product-type.seeder.js';
import { ProductSeeder } from '../../../../features/business/products/infrastructure/persistence/seeders/product.seeder.js';
import { SaleSeeder } from '../../../../features/business/sales/infrastructure/persistence/seeders/sale.seeder.js';
export declare class MainSeeder {
    private readonly clientSeeder;
    private readonly productTypeSeeder;
    private readonly productSeeder;
    private readonly saleSeeder;
    private readonly logger;
    constructor(clientSeeder: ClientSeeder, productTypeSeeder: ProductTypeSeeder, productSeeder: ProductSeeder, saleSeeder: SaleSeeder);
    run(): Promise<void>;
}
