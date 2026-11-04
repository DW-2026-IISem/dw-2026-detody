import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Op } from 'sequelize';
import { UserModel } from '../infrastructure/models/user.model.js';
import { LoginDto } from './dto/login.dto.js';

@Injectable()
export class SessionService {
  constructor(private readonly jwtService: JwtService) {}

  async login(dto: LoginDto) {
    const identifier = dto.identifier || (dto as any).username || (dto as any).email;

    if (!identifier) {
      throw new BadRequestException('El identificador (username o email) es requerido');
    }

    const password = dto.password;

    // Buscar usuario por username o email
    const user = await UserModel.findOne({
      where: {
        [Op.or]: [{ username: identifier }, { email: identifier }],
      },
    });

    if (!user || user.status !== 'active') {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = { sub: user.id, username: user.username, email: user.email };
    const secret = process.env.JWT_SECRET || 'hornoraiz-secret-key-change-me-0123456789';

    const accessToken = this.jwtService.sign(payload, {
      secret,
      expiresIn: Number(process.env.JWT_ACCESS_TTL) || 900,
    });

    const refreshDays = Number(process.env.JWT_REFRESH_TTL_DAYS) || 7;
    const refreshToken = this.jwtService.sign(payload, {
      secret,
      expiresIn: refreshDays * 86400,
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    };
  }
}
