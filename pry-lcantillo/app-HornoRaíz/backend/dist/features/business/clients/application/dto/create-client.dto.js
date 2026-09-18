var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
export class CreateClientDto {
    name;
    email;
    phone;
    address;
}
__decorate([
    ApiProperty({ example: 'Panadería Central' }),
    IsString(),
    IsNotEmpty({ message: 'name es requerido' }),
    MaxLength(150),
    __metadata("design:type", String)
], CreateClientDto.prototype, "name", void 0);
__decorate([
    ApiPropertyOptional({ example: 'contacto@panaderiacentral.com' }),
    IsOptional(),
    IsEmail({}, { message: 'email debe ser un correo válido' }),
    MaxLength(150),
    __metadata("design:type", String)
], CreateClientDto.prototype, "email", void 0);
__decorate([
    ApiPropertyOptional({ example: '3001234567' }),
    IsOptional(),
    IsString(),
    MaxLength(20),
    __metadata("design:type", String)
], CreateClientDto.prototype, "phone", void 0);
__decorate([
    ApiPropertyOptional({ example: 'Calle 10 # 5-20' }),
    IsOptional(),
    IsString(),
    MaxLength(255),
    __metadata("design:type", String)
], CreateClientDto.prototype, "address", void 0);
//# sourceMappingURL=create-client.dto.js.map