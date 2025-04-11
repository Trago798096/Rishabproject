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
      admin_users: {
        Row: {
          id: number
          username: string
          password: string
          created_at: string
        }
        Insert: {
          id?: number
          username: string
          password: string
          created_at?: string
        }
        Update: {
          id?: number
          username?: string
          password?: string
          created_at?: string
        }
        Relationships: []
      }
      matches: {
        Row: {
          id: number
          team1: string
          team2: string
          date: string
          venue: string
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: number
          team1: string
          team2: string
          date: string
          venue: string
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: number
          team1?: string
          team2?: string
          date?: string
          venue?: string
          is_active?: boolean
          created_at?: string
        }
        Relationships: []
      }
      ticket_types: {
        Row: {
          id: number
          match_id: number
          name: string
          price: number
          available_quantity: number
          created_at: string
        }
        Insert: {
          id?: number
          match_id: number
          name: string
          price: number
          available_quantity: number
          created_at?: string
        }
        Update: {
          id?: number
          match_id?: number
          name?: string
          price?: number
          available_quantity?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ticket_types_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          }
        ]
      }
      bookings: {
        Row: {
          id: number
          booking_id: string
          match_id: number
          ticket_type_id: number
          customer_name: string
          customer_email: string
          customer_phone: string
          quantity: number
          base_amount: number
          service_fee: number
          gst: number
          total_amount: number
          status: string
          payment_method: string | null
          utr_number: string | null
          created_at: string
        }
        Insert: {
          id?: number
          booking_id: string
          match_id: number
          ticket_type_id: number
          customer_name: string
          customer_email: string
          customer_phone: string
          quantity: number
          base_amount: number
          service_fee: number
          gst: number
          total_amount: number
          status?: string
          payment_method?: string | null
          utr_number?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          booking_id?: string
          match_id?: number
          ticket_type_id?: number
          customer_name?: string
          customer_email?: string
          customer_phone?: string
          quantity?: number
          base_amount?: number
          service_fee?: number
          gst?: number
          total_amount?: number
          status?: string
          payment_method?: string | null
          utr_number?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_ticket_type_id_fkey"
            columns: ["ticket_type_id"]
            isOneToOne: false
            referencedRelation: "ticket_types"
            referencedColumns: ["id"]
          }
        ]
      }
      upi_details: {
        Row: {
          id: number
          upi_id: string
          display_name: string
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: number
          upi_id: string
          display_name: string
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: number
          upi_id?: string
          display_name?: string
          is_active?: boolean
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
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