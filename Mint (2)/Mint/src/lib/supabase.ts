import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Database types
export interface Profile {
  id: string
  username: string
  full_name: string
  bio: string
  avatar_url: string
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  chat_id: string
  sender_id: string
  content: string
  color?: string
  created_at: string
}

export interface Chat {
  id: string
  participant_ids: string[]
  last_message?: Message
  created_at: string
  updated_at: string
}

export interface ChatParticipant {
  chat_id: string
  user_id: string
  profile: Profile
}
