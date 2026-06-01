import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          user_id: string;
          nome: string;
          avatar_url: string | null;
          is_kids: boolean;
          pin: string | null;
          idioma_audio: string;
          idioma_legenda: string;
          qualidade: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      contents: {
        Row: {
          id: string;
          tipo: 'filme' | 'serie';
          titulo: string;
          sinopse: string;
          ano: number;
          duracao_min: number | null;
          classificacao_etaria: string;
          generos: string[];
          thumbnail_url: string;
          backdrop_url: string;
          trailer_url: string | null;
          avaliacao: number;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['contents']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['contents']['Insert']>;
      };
      episodes: {
        Row: {
          id: string;
          content_id: string;
          temporada: number;
          numero_episodio: number;
          titulo: string;
          sinopse: string;
          duracao_min: number;
          thumbnail_url: string;
          video_url: string;
        };
        Insert: Omit<Database['public']['Tables']['episodes']['Row'], 'id'>;
        Update: Partial<Database['public']['Tables']['episodes']['Insert']>;
      };
      watch_history: {
        Row: {
          id: string;
          profile_id: string;
          content_id: string;
          episode_id: string | null;
          progresso_segundos: number;
          assistido_em: string;
          concluido: boolean;
        };
        Insert: Omit<Database['public']['Tables']['watch_history']['Row'], 'id'>;
        Update: Partial<Database['public']['Tables']['watch_history']['Insert']>;
      };
      my_list: {
        Row: {
          id: string;
          profile_id: string;
          content_id: string;
          adicionado_em: string;
        };
        Insert: Omit<Database['public']['Tables']['my_list']['Row'], 'id'>;
        Update: Partial<Database['public']['Tables']['my_list']['Insert']>;
      };
      ratings: {
        Row: {
          id: string;
          profile_id: string;
          content_id: string;
          curtiu: boolean;
          avaliado_em: string;
        };
        Insert: Omit<Database['public']['Tables']['ratings']['Row'], 'id'>;
        Update: Partial<Database['public']['Tables']['ratings']['Insert']>;
      };
    };
  };
};
