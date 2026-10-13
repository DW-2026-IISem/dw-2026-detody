import { IsNotEmpty, IsOptional, IsString, IsEnum } from 'class-validator';

export class CreateResourceDto {
  @IsString()
  @IsNotEmpty()
  @IsEnum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], {
    message: 'Method must be one of GET, POST, PUT, PATCH, DELETE',
  })
  method!: string;

  @IsString()
  @IsNotEmpty()
  path!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(['active', 'inactive'])
  status?: 'active' | 'inactive';
}
