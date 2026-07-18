import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://0ec90b57d6e95fcbda19832f.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJib2x0IiwicmVmIjoiMGVjOTBiNTdkNmU5NWZjYmRhMTk4MzJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4ODE1NzQsImV4cCI6MTc1ODg4MTU3NH0.9I8-U0x86Ak8t2DGaIk0HfvTSLsAyzdnz-Nw00mMkKw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export type Profile = {
  id: string;
  full_name: string;
  monthly_income: number;
  employment_status: string;
  age: number;
  dependents: number;
  city: string;
  financial_info_completed: boolean;
  goals_selected: boolean;
  analysis_completed: boolean;
  health_score: number;
  avatar_url: string;
  created_at: string;
  updated_at: string;
};

export type Transaction = {
  id: string;
  user_id: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  description: string;
  merchant: string;
  date: string;
  created_at: string;
};

export type Goal = {
  id: string;
  user_id: string;
  title: string;
  target_amount: number;
  current_amount: number;
  category: string;
  target_date: string;
  status: string;
  icon: string;
  created_at: string;
  updated_at: string;
};

export type Budget = {
  id: string;
  user_id: string;
  category: string;
  limit_amount: number;
  spent_amount: number;
  month: number;
  year: number;
  created_at: string;
};

export type Bill = {
  id: string;
  user_id: string;
  name: string;
  amount: number;
  due_date: string;
  category: string;
  status: string;
  recurring: boolean;
  created_at: string;
};

export type NotificationItem = {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  icon: string;
  created_at: string;
};

export type Achievement = {
  id: string;
  user_id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  earned_at: string;
};

export type ChatMessage = {
  id: string;
  user_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
};

export type Report = {
  id: string;
  user_id: string;
  month: number;
  year: number;
  total_income: number;
  total_expenses: number;
  savings: number;
  score: number;
  insights: Record<string, unknown>;
  created_at: string;
};
