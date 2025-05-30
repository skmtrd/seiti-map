// Supabase Database Types
export type Database = {
  public: {
    Tables: {
      spots: {
        Row: {
          id: number;
          name: string;
          prefecture: string;
          city: string;
          address: string | null;
          latitude: number;
          longitude: number;
          description: string | null;
          difficulty_level: number;
          visit_tips: string | null;
          work_id: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          prefecture: string;
          city: string;
          address?: string | null;
          latitude: number;
          longitude: number;
          description?: string | null;
          difficulty_level: number;
          visit_tips?: string | null;
          work_id: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          prefecture?: string;
          city?: string;
          address?: string | null;
          latitude?: number;
          longitude?: number;
          description?: string | null;
          difficulty_level?: number;
          visit_tips?: string | null;
          work_id?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      works: {
        Row: {
          id: number;
          title: string;
          type: "anime" | "manga" | "game" | "movie" | "novel" | "live_action";
          description: string | null;
          release_year: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          title: string;
          type: "anime" | "manga" | "game" | "movie" | "novel" | "live_action";
          description?: string | null;
          release_year?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          title?: string;
          type?: "anime" | "manga" | "game" | "movie" | "novel" | "live_action";
          description?: string | null;
          release_year?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      work_type: "anime" | "manga" | "game" | "movie" | "novel" | "live_action";
    };
  };
};

// 便利な型定義
export type Spot = Database["public"]["Tables"]["spots"]["Row"];
export type Work = Database["public"]["Tables"]["works"]["Row"];
export type SpotInsert = Database["public"]["Tables"]["spots"]["Insert"];
export type WorkInsert = Database["public"]["Tables"]["works"]["Insert"];

// JOINした結果の型定義
export type SpotWithWork = Spot & {
  works: Work;
};
