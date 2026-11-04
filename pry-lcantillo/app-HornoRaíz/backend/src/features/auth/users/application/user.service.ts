import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { UserRepository } from '../infrastructure/user.repository';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { comparePassword, hashPassword } from '../../../../shared/auth/password.util';
import { UserModel } from '../../infrastructure/models/user.model';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findAll() {
    return this.userRepository.findAll();
  }

  async findById(id: number) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    return user;
  }

  async create(dto: CreateUserDto) {
    const existing = await this.userRepository.findByUsernameOrEmail(dto.username, dto.email);
    if (existing) {
      throw new ConflictException('El nombre de usuario o correo electrónico ya están registrados');
    }
    return this.userRepository.create(dto);
  }

  async update(id: number, dto: UpdateUserDto) {
    await this.findById(id);
    await this.userRepository.update(id, dto);
    return this.findById(id);
  }

  async deactivate(id: number) {
    await this.findById(id);
    await this.userRepository.updateStatus(id, 'inactive');
    return { message: 'Usuario desactivado exitosamente' };
  }

  async delete(id: number) {
    await this.findById(id);
    await this.userRepository.delete(id);
    return { message: 'Usuario eliminado exitosamente' };
  }

  async changePassword(userId: number, dto: any) {
    const user = await UserModel.findByPk(userId);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const currentPass = dto.current_password || dto.currentPassword;
    const newPass = dto.new_password || dto.newPassword;

    const isMatch = await comparePassword(currentPass, user.password);
    if (!isMatch) {
      throw new BadRequestException('La contraseña actual es incorrecta');
    }

    const hashedNew = await hashPassword(newPass);
    await this.userRepository.updatePassword(userId, hashedNew);
    
    return { message: 'Contraseña actualizada exitosamente' };
  }
}
