import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, MaxLength, Min } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'Pan de Masa Madre Tradicional' })
  @IsString()
  @IsNotEmpty({ message: 'name es requerido' })
  @MaxLength(150)
  name!: string;

  @ApiPropertyOptional({ example: 'Pan de fermentación lenta de 24 horas' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;

  @ApiProperty({ example: 12000 })
  @IsNumber()
  @IsPositive({ message: 'price debe ser un número positivo' })
  price!: number;

  @ApiProperty({ example: 50 })
  @IsInt()
  @Min(0, { message: 'stock no puede ser negativo' })
  stock!: number;

  @ApiProperty({ example: 1, description: 'ID del tipo de producto' })
  @IsInt()
  @IsPositive()
  productTypeId!: number;
}
