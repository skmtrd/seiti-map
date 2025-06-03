// Supabase Database Types
export type Database = {
  public: {
    Tables: {
      spots: {
        Row: {
          id: string;
          work_id: string;
          name: string;
          description: string | null;
          scene_description: string | null;
          latitude: number;
          longitude: number;
          address: string | null;
          prefecture: string | null;
          city: string | null;
          visit_difficulty: number | null;
          best_visit_time: string | null;
          access_info: string | null;
          submitted_by: string | null;
          is_public: boolean;
          view_count: number;
          image_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          work_id: string;
          name: string;
          description?: string | null;
          scene_description?: string | null;
          latitude: number;
          longitude: number;
          address?: string | null;
          prefecture?: string | null;
          city?: string | null;
          visit_difficulty?: number | null;
          best_visit_time?: string | null;
          access_info?: string | null;
          submitted_by?: string | null;
          is_public?: boolean;
          view_count?: number;
          image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          work_id?: string;
          name?: string;
          description?: string | null;
          scene_description?: string | null;
          latitude?: number;
          longitude?: number;
          address?: string | null;
          prefecture?: string | null;
          city?: string | null;
          visit_difficulty?: number | null;
          best_visit_time?: string | null;
          access_info?: string | null;
          submitted_by?: string | null;
          is_public?: boolean;
          view_count?: number;
          image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      works: {
        Row: {
          id: string;
          title: string;
          type: "anime" | "drama" | "movie" | "game" | "novel" | "manga" | "other";
          description: string | null;
          release_year: number | null;
          created_by: string | null;
          is_public: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          type: "anime" | "drama" | "movie" | "game" | "novel" | "manga" | "other";
          description?: string | null;
          release_year?: number | null;
          created_by?: string | null;
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          type?: "anime" | "drama" | "movie" | "game" | "novel" | "manga" | "other";
          description?: string | null;
          release_year?: number | null;
          created_by?: string | null;
          is_public?: boolean;
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
      work_type: "anime" | "drama" | "movie" | "game" | "novel" | "manga" | "other";
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
