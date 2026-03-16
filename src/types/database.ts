export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          area: string;
          role: "resident" | "officer" | "admin";
          avatar_url: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          name: string;
          area?: string;
          role?: "resident" | "officer" | "admin";
          avatar_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          area?: string;
          role?: "resident" | "officer" | "admin";
          avatar_url?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      circulars: {
        Row: {
          id: string;
          title: string;
          content: string;
          category: "区役所" | "町会" | "防災" | "子育て" | "その他";
          published_at: string;
          attachment_url: string | null;
          is_urgent: boolean;
          author_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          content: string;
          category: "区役所" | "町会" | "防災" | "子育て" | "その他";
          published_at?: string;
          attachment_url?: string | null;
          is_urgent?: boolean;
          author_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          content?: string;
          category?: "区役所" | "町会" | "防災" | "子育て" | "その他";
          published_at?: string;
          attachment_url?: string | null;
          is_urgent?: boolean;
          author_id?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "circulars_author_id_fkey";
            columns: ["author_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      circular_reads: {
        Row: {
          id: string;
          circular_id: string;
          user_id: string;
          read_at: string;
        };
        Insert: {
          id?: string;
          circular_id: string;
          user_id: string;
          read_at?: string;
        };
        Update: {
          id?: string;
          circular_id?: string;
          user_id?: string;
          read_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "circular_reads_circular_id_fkey";
            columns: ["circular_id"];
            isOneToOne: false;
            referencedRelation: "circulars";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "circular_reads_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      events: {
        Row: {
          id: string;
          title: string;
          description: string;
          date: string;
          start_time: string;
          end_time: string;
          location: string;
          organizer: string;
          category: "地域" | "子育て" | "高齢者" | "防災" | "スポーツ" | "その他";
          max_participants: number | null;
          image_url: string | null;
          author_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          date: string;
          start_time: string;
          end_time: string;
          location: string;
          organizer: string;
          category: "地域" | "子育て" | "高齢者" | "防災" | "スポーツ" | "その他";
          max_participants?: number | null;
          image_url?: string | null;
          author_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          date?: string;
          start_time?: string;
          end_time?: string;
          location?: string;
          organizer?: string;
          category?: "地域" | "子育て" | "高齢者" | "防災" | "スポーツ" | "その他";
          max_participants?: number | null;
          image_url?: string | null;
          author_id?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "events_author_id_fkey";
            columns: ["author_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      event_participations: {
        Row: {
          id: string;
          event_id: string;
          user_id: string;
          joined_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          user_id: string;
          joined_at?: string;
        };
        Update: {
          id?: string;
          event_id?: string;
          user_id?: string;
          joined_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "event_participations_event_id_fkey";
            columns: ["event_id"];
            isOneToOne: false;
            referencedRelation: "events";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "event_participations_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      wellness_checks: {
        Row: {
          id: string;
          user_id: string;
          status: "genki" | "sukoshi" | "tsurai";
          checked_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          status: "genki" | "sukoshi" | "tsurai";
          checked_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          status?: "genki" | "sukoshi" | "tsurai";
          checked_at?: string;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
