import { IsNotEmpty, IsNumber, IsOptional, IsEnum } from 'class-validator';
export class CreateRoleUserDto {
  @IsNumber() @IsNotEmpty() user_id!: number;
  @IsNumber() @IsNotEmpty() role_id!: number;
  @IsOptional() @IsEnum(['active', 'inactive']) status?: 'active' | 'inactive';
}
