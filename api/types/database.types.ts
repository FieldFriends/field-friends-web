export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: Record<string, never>;
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };

  private_data: {
    Tables: {
      responses: {
        Row: {
          response_id: string;
          rsa_ciphertext: string;
          mlkem_ciphertext: string;
          encrypted_payload: string;
          submitted_at: string;
        };
        Insert: {
          response_id: string;
          rsa_ciphertext: string;
          mlkem_ciphertext: string;
          encrypted_payload: string;
          submitted_at?: string;
        };
        Update: {
          response_id?: string;
          rsa_ciphertext?: string;
          mlkem_ciphertext?: string;
          encrypted_payload?: string;
          submitted_at?: string;
        };
        Relationships: [];
      };
      banned_users: {
        Row: {
          id: string;
          email_hash: string;
          reason: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          email_hash: string;
          reason: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email_hash?: string;
          reason?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      app_settings: {
        Row: {
          id: number;
          is_paused: boolean;
          round_start: string;
          round_end: string;
        };
        Insert: {
          id?: number;
          is_paused?: boolean;
          round_start: string;
          round_end: string;
        };
        Update: {
          id?: number;
          is_paused?: boolean;
          round_start?: string;
          round_end?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      app_status: {
        Row: {
          current_state: 'paused' | 'scheduled' | 'open' | 'closed';
          round_start: string;
          round_end: string;
        };
        Relationships: [];
      };
    };
    Functions: {
      reset_project: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
    };
    Enums: Record<string, never>;
  };
}
