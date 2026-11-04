import { Status, Timestamps } from './api.model';

export interface Client extends Timestamps {
  id: number;
  name: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  status: Status;
}

export interface ClientPayload {
  name: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  status?: Status;
}
