import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Op } from 'sequelize';
import { UserModel } from '../infrastructure/models/user.model.js';
import { LoginDto } from './dto/login.dto.js';
import { RefreshTokensService } from '../refresh-tokens/refresh-tokens.service.js';

@Injectable()
export class SessionService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly refreshTokensService: RefreshTokensService,
  ) {}

  async login(dto: LoginDto, deviceInfo: string | null = null) {
    const identifier = dto.identifier || (dto as any).username || (dto as any).email;

    if (!identifier) {
      throw new BadRequestException('El identificador (username o email) es requerido');
    }

    const password = dto.password;

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

    const session = await this.refreshTokensService.issue(user.id, deviceInfo);

    return {
      access_token: accessToken,
      token_type: 'Bearer' as const,
      expires_in: Number(process.env.JWT_ACCESS_TTL) || 900,
      refresh_token: session.rawToken,
      refresh_expires_in: (Number(process.env.JWT_REFRESH_TTL_DAYS) || 7) * 86400,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        status: user.status,
      },
    };
  }

  async rotate(refreshToken: string, deviceInfo: string | null = null) {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token no proporcionado');
    }

    const outcome = await this.refreshTokensService.rotate(refreshToken, deviceInfo);

    if (outcome.kind === 'reuse') {
      throw new UnauthorizedException('Reuse detection: familia de refresh tokens revocada');
    }

    if (outcome.kind === 'invalid' || outcome.kind === 'expired') {
      throw new UnauthorizedException('Refresh token inválido o expirado');
    }

    const user = await UserModel.findByPk(outcome.userId);
    if (!user || user.status !== 'active') {
      throw new UnauthorizedException('Usuario inactivo o no encontrado');
    }

    const payload = { sub: user.id, username: user.username, email: user.email };
    const secret = process.env.JWT_SECRET || 'hornoraiz-secret-key-change-me-0123456789';

    const accessToken = this.jwtService.sign(payload, {
      secret,
      expiresIn: Number(process.env.JWT_ACCESS_TTL) || 900,
    });

    return {
      access_token: accessToken,
      token_type: 'Bearer' as const,
      expires_in: Number(process.env.JWT_ACCESS_TTL) || 900,
      refresh_token: outcome.rawToken,
      refresh_expires_in: (Number(process.env.JWT_REFRESH_TTL_DAYS) || 7) * 86400,
    };
  }

  async logout(refreshToken: string) {
    if (refreshToken) {
      await this.refreshTokensService.revokeByToken(refreshToken);
    }
    return { message: 'Sesión cerrada exitosamente' };
  }
}
