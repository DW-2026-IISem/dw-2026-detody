export type Status = 'active' | 'inactive';

export type Money = number | string;

export interface Timestamps {
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiError {
  statusCode: number;
  message: string | string[];
  error?: string;
}

export interface ApiResponse<T> {
  data?: T;
  items?: T[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages?: number;
  };
}

export function toNumber(value: Money | null | undefined): number {
  if (value === null || value === undefined) return 0;
  const parsed = typeof value === 'number' ? value : parseFloat(value.toString());
  return isNaN(parsed) ? 0 : parsed;
}
