import dotenv from "dotenv";

// Importación de modelos Auth desde su ubicación NestJS real
import "../../features/auth/infrastructure/models/user.model";
import "../../features/auth/infrastructure/models/role.model";
import "../../features/auth/infrastructure/models/resource.model";
import "../../features/auth/infrastructure/models/role-user.model";
import "../../features/auth/infrastructure/models/resource-role.model";
import "../../features/auth/infrastructure/models/refresh-token.model";

import { resolveSeedCounts } from "./counts";

dotenv.config();

export async function runAllSeeders(): Promise<void> {
  const counts = resolveSeedCounts();
  console.log("🌱 Iniciando SeedersRunner...");
  console.log("📊 Conteos:", counts);
  // Lógica de ejecución de seeders
  console.log("🌱 SeedersRunner finalizado");
}

if (require.main === module) {
  runAllSeeders()
    .then(() => {      process.exit(0);
    })
    .catch((err) => {      console.error("❌ Error en seeders:", err);
      process.exit(1);
    });
}
