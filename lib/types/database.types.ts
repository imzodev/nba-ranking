export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      players: {
        Row: {
          id: string
          name: string
          full_name: string | null
          position: string | null
          team: string | null
          jersey_number: string | null
          height: string | null
          weight: string | null
          birth_date: string | null
          birth_place: string | null
          nationality: string | null
          high_school: string | null
          college: string | null
          draft_year: string | null
          draft_round: string | null
          draft_pick: string | null
          draft_team: string | null
          career_start: string | null
          career_end: string | null
          years_active: string | null
          career_history: Json | null
          points: number | null
          rebounds: number | null
          assists: number | null
          ppg: number | null
          rpg: number | null
          apg: number | null
          championships: number | null
          mvps: number | null
          finals_mvps: number | null
          all_star: number | null
          all_nba: number | null
          all_defensive: number | null
          rookie_of_year: boolean | null
          hall_of_fame: boolean | null
          highlights: Json | null
          medals: Json | null
          image_url: string | null
          wikipedia_url: string | null
          raw_infobox: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          full_name?: string | null
          position?: string | null
          team?: string | null
          jersey_number?: string | null
          height?: string | null
          weight?: string | null
          birth_date?: string | null
          birth_place?: string | null
          nationality?: string | null
          high_school?: string | null
          college?: string | null
          draft_year?: string | null
          draft_round?: string | null
          draft_pick?: string | null
          draft_team?: string | null
          career_start?: string | null
          career_end?: string | null
          years_active?: string | null
          career_history?: Json | null
          points?: number | null
          rebounds?: number | null
          assists?: number | null
          ppg?: number | null
          rpg?: number | null
          apg?: number | null
          championships?: number | null
          mvps?: number | null
          finals_mvps?: number | null
          all_star?: number | null
          all_nba?: number | null
          all_defensive?: number | null
          rookie_of_year?: boolean | null
          hall_of_fame?: boolean | null
          highlights?: Json | null
          medals?: Json | null
          image_url?: string | null
          wikipedia_url?: string | null
          raw_infobox?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          full_name?: string | null
          position?: string | null
          team?: string | null
          jersey_number?: string | null
          height?: string | null
          weight?: string | null
          birth_date?: string | null
          birth_place?: string | null
          nationality?: string | null
          high_school?: string | null
          college?: string | null
          draft_year?: string | null
          draft_round?: string | null
          draft_pick?: string | null
          draft_team?: string | null
          career_start?: string | null
          career_end?: string | null
          years_active?: string | null
          career_history?: Json | null
          points?: number | null
          rebounds?: number | null
          assists?: number | null
          ppg?: number | null
          rpg?: number | null
          apg?: number | null
          championships?: number | null
          mvps?: number | null
          finals_mvps?: number | null
          all_star?: number | null
          all_nba?: number | null
          all_defensive?: number | null
          rookie_of_year?: boolean | null
          hall_of_fame?: boolean | null
          highlights?: Json | null
          medals?: Json | null
          image_url?: string | null
          wikipedia_url?: string | null
          raw_infobox?: Json | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      ranking_users: {
        Row: {
          id: string
          email: string
          name: string
          ip_address: string
          submission_count: number
          last_submission_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          ip_address: string
          submission_count?: number
          last_submission_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          ip_address?: string
          submission_count?: number
          last_submission_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_rankings: {
        Row: {
          id: string
          user_id: string
          player_id: string
          ranking_type: number
          rank: number
          submission_date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          player_id: string
          ranking_type: number
          rank: number
          submission_date: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          player_id?: string
          ranking_type?: number
          rank?: number
          submission_date?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_rankings_player_id_fkey"
            columns: ["player_id"]
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_rankings_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "ranking_users"
            referencedColumns: ["id"]
          }
        ]
      }
      aggregated_rankings: {
        Row: {
          id: string
          player_id: string
          rank: number
          ranking_type: number
          points: number
          average_rank: number
          appearances: number
          calculation_date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          player_id: string
          rank: number
          ranking_type: number
          points: number
          average_rank: number
          appearances: number
          calculation_date: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          player_id?: string
          rank?: number
          ranking_type?: number
          points?: number
          average_rank?: number
          appearances?: number
          calculation_date?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "aggregated_rankings_player_id_fkey"
            columns: ["player_id"]
            referencedRelation: "players"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: Record<string, never>
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
