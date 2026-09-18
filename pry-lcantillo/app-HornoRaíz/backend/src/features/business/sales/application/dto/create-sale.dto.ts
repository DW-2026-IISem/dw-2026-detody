import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsInt, IsPositive, ValidateNested } from 'class-validator';

export class CreateSaleItemDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  productId!: number;

  @ApiProperty({ example: 2 })
  @IsInt()
  @IsPositive()
  quantity!: number;
}

export class CreateSaleDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  clientId!: number;

  @ApiProperty({ type: [CreateSaleItemDto] })
  @IsArray()
  @ArrayMinSize(1, { message: 'Debe agregar al menos un ítem a la venta' })
  @ValidateNested({ each: true })
  @Type(() => CreateSaleItemDto)
  items!: CreateSaleItemDto[];
}
