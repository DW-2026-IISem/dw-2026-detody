import { IsOptional, IsString, IsEnum } from 'class-validator';

export class UpdateResourceDto {
  @IsOptional()
  @IsString()
  @IsEnum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE'])
  method?: string;

  @IsOptional()
  @IsString()
  path?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(['active', 'inactive'])
  status?: 'active' | 'inactive';
}
