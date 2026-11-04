import { Injectable } from '@nestjs/common';
import { Op, Transaction } from 'sequelize';
import { RefreshTokenModel } from '../infrastructure/models/refresh-token.model.js';

@Injectable()
export class RefreshTokensRepository {
  public async findByHash(
    tokenHash: string,
    transaction?: Transaction,
  ): Promise<RefreshTokenModel | null> {
    return RefreshTokenModel.findOne({
      where: { token_hash: tokenHash },
      transaction,
    });
  }

  public async findAllByUser(userId: number, onlyActive = true): Promise<RefreshTokenModel[]> {
    const where: any = { user_id: userId };
    if (onlyActive) where.status = 'active';
    return RefreshTokenModel.findAll({ where, order: [['createdAt', 'DESC']] });
  }

  public async findById(id: number): Promise<RefreshTokenModel | null> {
    return RefreshTokenModel.findByPk(id);
  }

  public async create(data: any, transaction?: Transaction): Promise<RefreshTokenModel> {
    return RefreshTokenModel.create(data, { transaction });
  }

  public async update(
    token: RefreshTokenModel,
    data: any,
    transaction?: Transaction
  ): Promise<RefreshTokenModel> {
    return token.update(data, { transaction });
  }

  public async revokeFamily(familyId: string, transaction?: Transaction): Promise<number> {
    const [updated] = await RefreshTokenModel.update(
      { status: 'inactive' },
      { where: { family_id: familyId, status: 'active' }, transaction }
    );
    return updated;
  }

  public async revokeAllByUser(userId: number): Promise<number> {
    const [updated] = await RefreshTokenModel.update(
      { status: 'inactive' },
      { where: { user_id: userId, status: 'active' } }
    );
    return updated;
  }

  public async purgeInactiveByUser(userId: number): Promise<number> {
    return RefreshTokenModel.destroy({
      where: {
        user_id: userId,
        [Op.or]: [{ status: 'inactive' }, { expires_at: { [Op.lt]: new Date() } }],
      },
    });
  }

  public async countActiveByUser(userId: number): Promise<number> {
    return RefreshTokenModel.count({ where: { user_id: userId, status: 'active' } });
  }
}
