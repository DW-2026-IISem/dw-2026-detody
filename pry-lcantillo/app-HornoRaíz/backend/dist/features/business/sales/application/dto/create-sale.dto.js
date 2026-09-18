var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsInt, IsPositive, ValidateNested } from 'class-validator';
export class CreateSaleItemDto {
    productId;
    quantity;
}
__decorate([
    ApiProperty({ example: 1 }),
    IsInt(),
    IsPositive(),
    __metadata("design:type", Number)
], CreateSaleItemDto.prototype, "productId", void 0);
__decorate([
    ApiProperty({ example: 2 }),
    IsInt(),
    IsPositive(),
    __metadata("design:type", Number)
], CreateSaleItemDto.prototype, "quantity", void 0);
export class CreateSaleDto {
    clientId;
    items;
}
__decorate([
    ApiProperty({ example: 1 }),
    IsInt(),
    IsPositive(),
    __metadata("design:type", Number)
], CreateSaleDto.prototype, "clientId", void 0);
__decorate([
    ApiProperty({ type: [CreateSaleItemDto] }),
    IsArray(),
    ArrayMinSize(1, { message: 'Debe agregar al menos un ítem a la venta' }),
    ValidateNested({ each: true }),
    Type(() => CreateSaleItemDto),
    __metadata("design:type", Array)
], CreateSaleDto.prototype, "items", void 0);
//# sourceMappingURL=create-sale.dto.js.map