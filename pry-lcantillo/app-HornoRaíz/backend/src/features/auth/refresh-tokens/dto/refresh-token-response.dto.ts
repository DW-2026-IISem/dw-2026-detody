import { RefreshTokenModel } from '../refresh-token.model';

export type RefreshTokenResponseDto = Omit<any, 'token_hash'> & {
  is_expired: boolean;
};

export function toRefreshTokenResponse(token: RefreshTokenModel): RefreshTokenResponseDto {
  const plain = token.toJSON ? token.toJSON() : (token as any);
  const { token_hash, ...safe } = plain;
  return {
    ...safe,
    is_expired: new Date(token.expires_at).getTime() <= Date.now(),
  };
}
