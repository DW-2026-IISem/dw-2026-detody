import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateProductTypeDto {
  @ApiProperty({ example: 'Panes Artesanales' })
  @IsString()
  @IsNotEmpty({ message: 'name es requerido' })
  @MaxLength(100)
  name!: string;

  @ApiPropertyOptional({ example: 'Productos elaborados con masa madre y cocción en horno de piedra' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;
}
