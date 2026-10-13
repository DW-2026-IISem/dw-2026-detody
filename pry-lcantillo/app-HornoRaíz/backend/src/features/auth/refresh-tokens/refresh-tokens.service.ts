import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Transaction } from 'sequelize';
import { randomUUID } from 'node:crypto';
import { RefreshTokenResponseDto, toRefreshTokenResponse } from './dto';
import { RefreshTokensRepository } from './refresh-tokens.repository';
import { RefreshTokenModel } from './refresh-token.model';
import { generateOpaqueToken, sha256Hex } from '../../../shared/auth/password';

const REFRESH_TTL_DAYS = Number(process.env.JWT_REFRESH_TTL_DAYS ?? 7);

export interface IssuedSession {
  rawToken: string;
  familyId: string;
  expiresAt: Date;
}

export type RotationOutcome =
  | { kind: 'rotated'; userId: number; rawToken: string; familyId: string; expiresAt: Date }
  | { kind: 'invalid' }
  | { kind: 'expired' }
  | { kind: 'reuse'; familyId: string; revoked: number };

@Injectable()
export class RefreshTokensService {
  constructor(
    private readonly repository: RefreshTokensRepository,
    @InjectConnection() private readonly sequelize: Sequelize
  ) {}

  // ================== GESTIÓN (sesiones propias) ==================
  public async getAllMine(userId: number): Promise<RefreshTokenResponseDto[]> {
    const tokens = await this.repository.findAllByUser(userId);
    return tokens.map((token) => toRefreshTokenResponse(token));
  }

  public async getMine(userId: number, id: number): Promise<RefreshTokenResponseDto> {
    return toRefreshTokenResponse(await this.findMineOrFail(userId, id));
  }

  public async revokeMine(userId: number, id: number): Promise<RefreshTokenResponseDto> {
    const token = await this.findMineOrFail(userId, id);
    await this.repository.update(token, { revoked: true });
    return toRefreshTokenResponse(token);
  }

  public async revokeAllMine(userId: number): Promise<number> {
    return this.repository.revokeAllByUser(userId);
  }

  public async purgeMine(userId: number): Promise<number> {
    return this.repository.purgeInactiveByUser(userId);
  }

  public async countActiveMine(userId: number): Promise<number> {
    return this.repository.countActiveByUser(userId);
  }

  // ================== CICLO DE VIDA ==================
  public async issue(
    userId: number,
    deviceInfo: string | null,
    transaction?: Transaction
  ): Promise<IssuedSession> {
    const rawToken = generateOpaqueToken();
    const familyId = randomUUID();
    const expiresAt = expiryFromNow();

    await this.repository.create(
      {
        user_id: userId,
        token_hash: sha256Hex(rawToken),
        family_id: familyId,
        device_info: deviceInfo,
        expires_at: expiresAt,
        revoked: false,
      },
      transaction
    );

    return { rawToken, familyId, expiresAt };
  }

  public async rotate(rawToken: string, deviceInfo: string | null): Promise<RotationOutcome> {
    const hash = sha256Hex(rawToken);

    return this.sequelize.transaction(async (t) => {
      const current = await this.repository.findByHash(hash, t, true);
      if (!current) {
        return { kind: 'invalid' };
      }

      // REUSE DETECTION: el token existía pero ya está revocado
      if (current.revoked) {
        const revoked = await this.repository.revokeFamily(current.family_id, t);
        return { kind: 'reuse', familyId: current.family_id, revoked };
      }

      if (new Date(current.expires_at).getTime() <= Date.now()) {
        await this.repository.update(current, { revoked: true }, t);
        return { kind: 'expired' };
      }

      // Rotación
      await this.repository.update(current, { revoked: true }, t);
      const rawNext = generateOpaqueToken();
      const expiresAt = expiryFromNow();

      await this.repository.create(
        {
          user_id: current.user_id,
          token_hash: sha256Hex(rawNext),
          family_id: current.family_id,
          device_info: deviceInfo ?? current.device_info,
          expires_at: expiresAt,
          revoked: false,
        },
        t
      );

      return {
        kind: 'rotated',
        userId: current.user_id,
        rawToken: rawNext,
        familyId: current.family_id,
        expiresAt,
      };
    });
  }

  public async revokeByToken(rawToken: string): Promise<boolean> {
    const token = await this.repository.findByHash(sha256Hex(rawToken));
    if (!token) return false;
    if (token.revoked) return true;
    await this.repository.update(token, { revoked: true });
    return true;
  }

  private async findMineOrFail(userId: number, id: number): Promise<RefreshTokenModel> {
    const token = await this.repository.findById(id);
    if (!token || token.user_id !== userId) {
      throw new NotFoundException('Session not found');
    }
    return token;
  }
}

function expiryFromNow(): Date {
  return new Date(Date.now() + REFRESH_TTL_DAYS * 24 * 60 * 60 * 1000);
}
