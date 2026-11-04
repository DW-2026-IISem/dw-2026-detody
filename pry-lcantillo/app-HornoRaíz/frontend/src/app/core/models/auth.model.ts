export interface SessionTokens {
  accessToken: string;
  refreshToken?: string;
}

export interface EffectivePermission {
  resource: string;
  route_path?: string;
  routePath?: string;
  http_method?: string;
  httpMethod?: string;
  action?: string;
}

export interface AuthSession {
  user: {
    id: number;
    username: string;
    email: string;
    avatar?: string | null;
    status: string;
  };
  roles: string[];
  permissions: EffectivePermission[];
  tokens: SessionTokens;
}
