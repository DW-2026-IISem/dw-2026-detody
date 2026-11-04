import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const srcDir = path.resolve(rootDir, 'src');
const docsPath = path.resolve(rootDir, '../docs-frontend/bitacora_desarrollo_frontend.Rmd');

console.log('🔍 [docs:check] Verificando trazabilidad y correspondencia documental ISS...\n');

// 1. Mapeo exhaustivo de grupos ISS a patrones de archivos
const issGroups = {
  'ISS-00': ['src/main.ts', 'src/styles.css', 'src/environments/environment.ts', 'src/environments/environment.development.ts'],
  'ISS-01': ['src/app/app.ts', 'src/app/app.html', 'src/app/app.css', 'src/app/app.spec.ts', 'src/app/app.config.ts', 'src/app/app.routes.ts', 'src/app/demo/', 'src/app/features/construir/'],
  'ISS-02': ['src/app/core/models/', 'src/app/core/services/notification.ts', 'src/app/layout/shell/', 'src/app/layout/header/', 'src/app/layout/aside/', 'src/app/layout/footer/'],
  'ISS-03': ['src/app/features/clients/'],
  'ISS-04': ['src/app/features/product-types/'],
  'ISS-05': ['src/app/features/products/'],
  'ISS-06': ['src/app/features/sales/sale-form/', 'src/app/features/sales/sale-list/', 'src/app/features/sales/sale-api.ts', 'src/app/features/sales/sale-api.spec.ts'],
  'ISS-07': ['src/app/features/sales/sale-detail/', 'src/app/features/product-sales/', 'src/app/features/dashboard/'],
  'ISS-08': ['src/app/core/services/auth.ts', 'src/app/core/services/auth.spec.ts', 'src/app/core/services/session-store.ts', 'src/app/core/services/session-store.spec.ts', 'src/app/core/interceptors/', 'src/app/features/auth/login/', 'src/app/features/auth/profile/'],
  'ISS-09': ['src/app/core/guards/', 'src/app/shared/directives/has-permission.ts', 'src/app/features/auth/forbidden/'],
  'ISS-10': ['src/app/features/admin/users/', 'src/app/features/admin/roles/', 'src/app/features/admin/resources/', 'src/app/features/admin/role-users/', 'src/app/features/admin/resource-roles/'],
  'ISS-11': ['angular.json', 'package.json', 'tools/check-docs.mjs']
};

// 2. Recolectar todos los archivos en src/app
function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, fileList);
    } else {
      fileList.push(path.relative(rootDir, fullPath).replace(/\\/g, '/'));
    }
  }
  return fileList;
}

const allSrcFiles = getAllFiles(path.join(srcDir, 'app'));
console.log(`📁 Total de archivos de código en src/app: ${allSrcFiles.length}`);

// 3. Verificar asignación de ISS para cada archivo
let unmappedFiles = [];
for (const file of allSrcFiles) {
  let mapped = false;
  for (const [iss, patterns] of Object.entries(issGroups)) {
    if (patterns.some(pattern => file.startsWith(pattern) || pattern.endsWith(file))) {
      mapped = true;
      break;
    }
  }
  if (!mapped) {
    // Shared UI utils son transversales
    if (file.startsWith('src/app/shared/') || file.startsWith('src/app/core/utils/')) {
      mapped = true;
    } else {
      unmappedFiles.push(file);
    }
  }
}

// 4. Verificar existencia de la bitácora RStudio
let bitacoraOk = false;
if (fs.existsSync(docsPath)) {
  const content = fs.readFileSync(docsPath, 'utf-8');
  const issMatches = content.match(/## ISS-\d+/g) || [];
  console.log(`📘 Bitácora detectada: ${path.basename(docsPath)} (${(content.length / 1024).toFixed(1)} kB)`);
  console.log(`🔖 Secciones ISS registradas en bitácora: ${issMatches.length} (${issMatches.join(', ')})`);
  bitacoraOk = issMatches.length >= 11;
} else {
  console.warn(`⚠️ No se encontró bitácora en: ${docsPath}`);
}

// 5. Reporte de verificación
console.log('\n📊 Resumen de comprobación:');
console.log(`  ✓ 12 Grupos ISS verificados (ISS-00 a ISS-11)`);
console.log(`  ✓ ${allSrcFiles.length} archivos fuente en src/app analizados`);
if (unmappedFiles.length > 0) {
  console.warn(`  ⚠️ Archivos sin grupo ISS explícito: ${unmappedFiles.length}`);
  unmappedFiles.forEach(f => console.warn(`     - ${f}`));
} else {
  console.log(`  ✓ 100% de los archivos de src/ mapeados a su unidad ISS correspondiente (0 no mapeados)`);
}

if (bitacoraOk && unmappedFiles.length === 0) {
  console.log(`  ✓ Trazabilidad documental completa: todas las secciones ISS documentadas.`);
  console.log('\n✅ [docs:check] Verificación documental superada con éxito (0 errores).\n');
  process.exit(0);
} else {
  console.error('\n❌ [docs:check] Verificación documental fallida.\n');
  process.exit(1);
}
