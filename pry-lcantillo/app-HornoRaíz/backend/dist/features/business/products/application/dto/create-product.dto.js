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
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, MaxLength, Min } from 'class-validator';
export class CreateProductDto {
    name;
    description;
    price;
    stock;
    productTypeId;
}
__decorate([
    ApiProperty({ example: 'Pan de Masa Madre Tradicional' }),
    IsString(),
    IsNotEmpty({ message: 'name es requerido' }),
    MaxLength(150),
    __metadata("design:type", String)
], CreateProductDto.prototype, "name", void 0);
__decorate([
    ApiPropertyOptional({ example: 'Pan de fermentación lenta de 24 horas' }),
    IsOptional(),
    IsString(),
    MaxLength(255),
    __metadata("design:type", String)
], CreateProductDto.prototype, "description", void 0);
__decorate([
    ApiProperty({ example: 12000 }),
    IsNumber(),
    IsPositive({ message: 'price debe ser un número positivo' }),
    __metadata("design:type", Number)
], CreateProductDto.prototype, "price", void 0);
__decorate([
    ApiProperty({ example: 50 }),
    IsInt(),
    Min(0, { message: 'stock no puede ser negativo' }),
    __metadata("design:type", Number)
], CreateProductDto.prototype, "stock", void 0);
__decorate([
    ApiProperty({ example: 1, description: 'ID del tipo de producto' }),
    IsInt(),
    IsPositive(),
    __metadata("design:type", Number)
], CreateProductDto.prototype, "productTypeId", void 0);
//# sourceMappingURL=create-product.dto.js.map