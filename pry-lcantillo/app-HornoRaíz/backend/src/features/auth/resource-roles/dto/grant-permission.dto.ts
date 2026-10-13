import { IsNotEmpty, IsNumber, IsOptional, IsEnum } from 'class-validator';
export class GrantPermissionDto {
  @IsNumber() @IsNotEmpty() role_id!: number;
  @IsNumber() @IsNotEmpty() resource_id!: number;
  @IsOptional() @IsEnum(['active', 'inactive']) status?: 'active' | 'inactive';
}
