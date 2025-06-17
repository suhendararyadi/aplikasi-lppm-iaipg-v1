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
      laporan: {
        Row: {
          id: number
          created_at: string
          tanggal_kegiatan: string
          bidang_penelitian: Database["public"]["Enums"]["research_field"]
          judul_kegiatan: string
          tempat_pelaksanaan: string | null
          narasumber: string | null
          mahasiswa_terlibat: string[] | null
          unsur_terlibat: string | null
          deskripsi_kegiatan: string | null
          dokumen_pendukung_url: string | null
          rencana_tindak_lanjut: string | null
          status: Database["public"]["Enums"]["report_status"]
          feedback_dpl: string | null
          mahasiswa_id: string
          dpl_id: string | null
        }
        Insert: {
          id?: number
          created_at?: string
          tanggal_kegiatan: string
          bidang_penelitian: Database["public"]["Enums"]["research_field"]
          judul_kegiatan: string
          tempat_pelaksanaan?: string | null
          narasumber?: string | null
          mahasiswa_terlibat?: string[] | null
          unsur_terlibat?: string | null
          deskripsi_kegiatan?: string | null
          dokumen_pendukung_url?: string | null
          rencana_tindak_lanjut?: string | null
          status?: Database["public"]["Enums"]["report_status"]
          feedback_dpl?: string | null
          mahasiswa_id: string
          dpl_id?: string | null
        }
        Update: {
          id?: number
          created_at?: string
          tanggal_kegiatan?: string
          bidang_penelitian?: Database["public"]["Enums"]["research_field"]
          judul_kegiatan?: string
          tempat_pelaksanaan?: string | null
          narasumber?: string | null
          mahasiswa_terlibat?: string[] | null
          unsur_terlibat?: string | null
          deskripsi_kegiatan?: string | null
          dokumen_pendukung_url?: string | null
          rencana_tindak_lanjut?: string | null
          status?: Database["public"]["Enums"]["report_status"]
          feedback_dpl?: string | null
          mahasiswa_id?: string
          dpl_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "laporan_dpl_id_fkey"
            columns: ["dpl_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "laporan_mahasiswa_id_fkey"
            columns: ["mahasiswa_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          id: string
          updated_at: string | null
          full_name: string | null
          avatar_url: string | null
          role: Database["public"]["Enums"]["user_role"]
          identity_number: string | null
          dpl_id: string | null
        }
        Insert: {
          id: string
          updated_at?: string | null
          full_name?: string | null
          avatar_url?: string | null
          role: Database["public"]["Enums"]["user_role"]
          identity_number?: string | null
          dpl_id?: string | null
        }
        Update: {
          id?: string
          updated_at?: string | null
          full_name?: string | null
          avatar_url?: string | null
          role?: Database["public"]["Enums"]["user_role"]
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
      report_status: "Menunggu Verifikasi" | "Revisi" | "Disetujui"
      research_field:
        | "Pendidikan"
        | "Sosial"
        | "Sains & Teknologi"
        | "Ekonomi"
        | "Kesehatan"
        | "Seni & Budaya"
        | "Lainnya"
      user_role: "LPPM" | "DPL" | "MAHASISWA"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
