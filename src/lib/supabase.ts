import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      prospects: {
        Row: {
          id: string
          contact_name: string
          company: string
          phone: string
          email: string
          service: string
          status: string
          assigned_to: string
          tags: string[]
          notes: { date: string; content: string }[]
          created_at: string
        }
        Insert: {
          id?: string
          contact_name: string
          company: string
          phone: string
          email: string
          service: string
          status: string
          assigned_to: string
          tags: string[]
          notes: { date: string; content: string }[]
          created_at?: string
        }
        Update: {
          id?: string
          contact_name?: string
          company?: string
          phone?: string
          email?: string
          service?: string
          status?: string
          assigned_to?: string
          tags?: string[]
          notes?: { date: string; content: string }[]
          created_at?: string
        }
      }
      sales_scripts: {
        Row: {
          id: string
          title: string
          content: string
          client_type: string
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          client_type: string
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          client_type?: string
          created_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          type: 'income' | 'expense'
          amount: number
          category: string
          description: string
          date: string
          created_at: string
        }
        Insert: {
          id?: string
          type: 'income' | 'expense'
          amount: number
          category: string
          description: string
          date: string
          created_at?: string
        }
        Update: {
          id?: string
          type?: 'income' | 'expense'
          amount?: number
          category?: string
          description?: string
          date?: string
          created_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          title: string
          description: string
          assigned_to: string
          due_date: string
          priority: 'high' | 'medium' | 'low'
          completed: boolean
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          assigned_to: string
          due_date: string
          priority: 'high' | 'medium' | 'low'
          completed?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          assigned_to?: string
          due_date?: string
          priority?: 'high' | 'medium' | 'low'
          completed?: boolean
          created_at?: string
        }
      }
      goals: {
        Row: {
          id: string
          title: string
          description: string
          assigned_to: string
          due_date: string
          completed: boolean
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          assigned_to: string
          due_date: string
          completed?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          assigned_to?: string
          due_date?: string
          completed?: boolean
          created_at?: string
        }
      }
      calendar_events: {
        Row: {
          id: number
          type: 'tarea' | 'ingreso' | 'gasto' | 'reunion'
          title: string
          start_date: string
          end_date: string
          description: string | null
          related: string | null
          created_at: string
        }
        Insert: {
          id?: number
          type: 'tarea' | 'ingreso' | 'gasto' | 'reunion'
          title: string
          start_date: string
          end_date: string
          description?: string | null
          related?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          type?: 'tarea' | 'ingreso' | 'gasto' | 'reunion'
          title?: string
          start_date?: string
          end_date?: string
          description?: string | null
          related?: string | null
          created_at?: string
        }
      }
      tours: {
        Row: {
          id: string
          url: string
          title: string
          label: string
          created_at: string
        }
        Insert: {
          id?: string
          url: string
          title: string
          label: string
          created_at?: string
        }
        Update: {
          id?: string
          url?: string
          title?: string
          label?: string
          created_at?: string
        }
      }
    }
  }
}