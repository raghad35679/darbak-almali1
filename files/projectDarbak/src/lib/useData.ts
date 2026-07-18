import { useState, useEffect, useCallback } from 'react';
import { supabase, type Transaction, type Goal, type Budget, type Bill, type NotificationItem, type Achievement, type ChatMessage } from './supabase';
import { useAuth } from './auth';
import { analyzeFinances, type FinancialAnalysis } from './ai';

export function useUserData() {
  const { user, profile } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState<FinancialAnalysis | null>(null);

  const fetchAll = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    const [txRes, goalRes, budgetRes, billRes, notifRes, achRes, chatRes] = await Promise.all([
      supabase.from('transactions').select('*').eq('user_id', user.id).order('date', { ascending: false }),
      supabase.from('goals').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
      supabase.from('budgets').select('*').eq('user_id', user.id),
      supabase.from('bills').select('*').eq('user_id', user.id).order('due_date', { ascending: true }),
      supabase.from('notifications').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
      supabase.from('achievements').select('*').eq('user_id', user.id).order('earned_at', { ascending: false }),
      supabase.from('chat_messages').select('*').eq('user_id', user.id).order('created_at', { ascending: true }),
    ]);

    setTransactions((txRes.data || []) as Transaction[]);
    setGoals((goalRes.data || []) as Goal[]);
    setBudgets((budgetRes.data || []) as Budget[]);
    setBills((billRes.data || []) as Bill[]);
    setNotifications((notifRes.data || []) as NotificationItem[]);
    setAchievements((achRes.data || []) as Achievement[]);
    setChatMessages((chatRes.data || []) as ChatMessage[]);

    const a = analyzeFinances(
      profile?.monthly_income || 0,
      txRes.data || [],
      goalRes.data || [],
      budgetRes.data || [],
      billRes.data || []
    );
    setAnalysis(a);
    setLoading(false);
  }, [user, profile]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return {
    transactions, goals, budgets, bills, notifications, achievements, chatMessages,
    loading, analysis, refetch: fetchAll,
    setTransactions, setGoals, setBudgets, setBills, setNotifications, setChatMessages,
  };
}
