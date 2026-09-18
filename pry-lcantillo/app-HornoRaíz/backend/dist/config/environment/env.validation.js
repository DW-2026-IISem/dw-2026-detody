var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { plainToInstance } from 'class-transformer';
import { IsIn, IsNotEmpty, ValidateIf, validateSync } from 'class-validator';
const DIALECTS = ['mysql', 'postgres', 'mssql', 'oracle'];
export class EnvVariables {
    DB_DIALECT;
    DB_MYSQL_HOST;
}
__decorate([
    IsIn(DIALECTS, { message: 'DB_DIALECT debe ser mysql | postgres | mssql | oracle' }),
    __metadata("design:type", String)
], EnvVariables.prototype, "DB_DIALECT", void 0);
__decorate([
    ValidateIf((o) => o.DB_DIALECT === 'mysql'),
    IsNotEmpty({ message: 'DB_MYSQL_HOST es requerida' }),
    __metadata("design:type", String)
], EnvVariables.prototype, "DB_MYSQL_HOST", void 0);
export function validateEnv(raw) {
    const config = plainToInstance(EnvVariables, raw);
    const errors = validateSync(config, { whitelist: false, forbidNonWhitelisted: false });
    if (errors.length > 0) {
        const messages = errors.map((e) => Object.values(e.constraints ?? {}).join('; ')).join(' | ');
        throw new Error(`Error de configuración: ${messages}`);
    }
    return config;
}
//# sourceMappingURL=env.validation.js.map