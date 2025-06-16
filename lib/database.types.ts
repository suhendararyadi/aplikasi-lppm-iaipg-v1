export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          updated_at: string | null
          full_name: string | null
          avatar_url: string | null
          role: "LPPM" | "DPL" | "MAHASISWA"
          identity_number: string | null
          dpl_id: string | null
        }
        Insert: {
          id: string
          updated_at?: string | null
          full_name?: string | null
          avatar_url?: string | null
          role: "LPPM" | "DPL" | "MAHASISWA"
          identity_number?: string | null
          dpl_id?: string | null
        }
        Update: {
          id?: string
          updated_at?: string | null
          full_name?: string | null
          avatar_url?: string | null
          role?: "LPPM" | "DPL" | "MAHASISWA"
          identity_number?: string | null
          dpl_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_dpl_id_fkey"
            columns: ["dpl_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: "LPPM" | "DPL" | "MAHASISWA"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
