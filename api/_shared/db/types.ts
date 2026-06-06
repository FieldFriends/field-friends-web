import { Generated } from 'kysely';

export interface ResponsesTable {
  response_id: string;
  rsa_ciphertext: string;
  mlkem_ciphertext: string;
  encrypted_payload: string;
  submitted_at: Generated<string>;
}

export interface BannedUsersTable {
  id: Generated<string>;
  email_hash: string;
  reason: string;
  created_at: Generated<string>;
}

export interface AppSettingsTable {
  id: Generated<number>;
  is_paused: Generated<boolean>;
  round_start: string;
  round_end: string;
}

export interface AppStatusView {
  current_state: 'paused' | 'scheduled' | 'open' | 'closed';
  round_start: string;
  round_end: string;
}

export interface KyselyDatabase {
  responses: ResponsesTable;
  banned_users: BannedUsersTable;
  app_settings: AppSettingsTable;
  app_status: AppStatusView;
}
