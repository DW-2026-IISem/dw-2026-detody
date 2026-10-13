import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Transaction } from 'sequelize';
import { RefreshTokenModel } from './refresh-token.model';

@Injectable()
export class RefreshTokensRepository {
  constructor(
    @InjectModel(RefreshTokenModel)
    private readonly refreshTokenModel: typeof RefreshTokenModel,
  ) {}

  public async findByHash(
    tokenHash: string,
    transaction?: Transaction,
    lock = false
  ): Promise<RefreshTokenModel | null> {
    return this.refreshTokenModel.findOne({
      where: { token_hash: tokenHash },
      transaction,
      ...(lock && transaction ? { lock: transaction.LOCK.UPDATE } : {}),
    });
  }

  public async findAllByUser(userId: number, onlyActive = true): Promise<RefreshTokenModel[]> {
    const where: Record<string, unknown> = { user_id: userId };
    if (onlyActive) where.revoked = false;
    return this.refreshTokenModel.findAll({ where, order: [['createdAt', 'DESC']] });
  }

  public async findById(id: number): Promise<RefreshTokenModel | null> {
    return this.refreshTokenModel.findByPk(id);
  }

  public async create(data: any, transaction?: Transaction): Promise<RefreshTokenModel> {
    return this.refreshTokenModel.create(data, { transaction });
  }

  public async update(
    token: RefreshTokenModel,
    data: Partial<RefreshTokenModel>,
    transaction?: Transaction
  ): Promise<RefreshTokenModel> {
    return token.update(data, { transaction });
  }

  public async revokeFamily(familyId: string, transaction?: Transaction): Promise<number> {
    const [updated] = await this.refreshTokenModel.update(
      { revoked: true },
      { where: { family_id: familyId, revoked: false }, transaction }
    );
    return updated;
  }

  public async revokeAllByUser(userId: number): Promise<number> {
    const [updated] = await this.refreshTokenModel.update(
      { revoked: true },
      { where: { user_id: userId, revoked: false } }
    );
    return updated;
  }

  public async purgeInactiveByUser(userId: number): Promise<number> {
    return this.refreshTokenModel.destroy({
      where: {
        user_id: userId,
        [Op.or]: [{ revoked: true }, { expires_at: { [Op.lt]: new Date() } }],
      },
    });
  }

  public async countActiveByUser(userId: number): Promise<number> {
    return this.refreshTokenModel.count({ where: { user_id: userId, revoked: false } });
  }
}
