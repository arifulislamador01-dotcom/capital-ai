import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://demo-project.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_service';

// Client-side Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side Supabase client with service role
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Database types
export interface User {
  id: string;
  clerk_id: string;
  email: string;
  name: string;
  avatar_url: string;
  is_premium: boolean;
  tier: number;
  credits_remaining: number;
  credits_reset_at: string;
  expires_at: string | null;
  created_at: string;
}

export interface ToolUsage {
  id: string;
  user_id: string;
  tool_name: string;
  credits_used: number;
  created_at: string;
}

// Helper functions
export async function getOrCreateUser(clerkId: string, email?: string, name?: string, avatarUrl?: string) {
  const { data: existingUser } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('clerk_id', clerkId)
    .single();

  if (existingUser) return existingUser as User;

  const { data: newUser, error } = await supabaseAdmin
    .from('users')
    .insert({
      clerk_id: clerkId,
      email: email || '',
      name: name || '',
      avatar_url: avatarUrl || '',
    })
    .select()
    .single();

  if (error) throw error;
  return newUser as User;
}

export async function getUserByClerkId(clerkId: string) {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('clerk_id', clerkId)
    .single();

  if (error) return null;
  return data as User;
}
