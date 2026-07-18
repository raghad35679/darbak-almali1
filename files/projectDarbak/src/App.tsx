import { useState } from 'react';
import { AuthProvider, useAuth } from './lib/auth';
import { LoginPage } from './pages/LoginPage';
import { FinancialInfoPage } from './pages/FinancialInfoPage';
import { GoalsSelectionPage } from './pages/GoalsSelectionPage';
import { AIAnalysisPage } from './pages/AIAnalysisPage';
import { DashboardPage } from './pages/DashboardPage';
import { RecommendationsPage } from './pages/RecommendationsPage';
import { BudgetPlannerPage } from './pages/BudgetPlannerPage';
import { GoalsPage } from './pages/GoalsPage';
import { ReportsPage } from './pages/ReportsPage';
import { AssistantPage } from './pages/AssistantPage';
import { LearningCenterPage } from './pages/LearningCenterPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { AppShell, type Page } from './components/AppShell';

function AppContent() {
  const { user, profile, loading } = useAuth();
  const [page, setPage] = useState<Page>('dashboard');

  if (loading) {
    return (
      <div className="min-h-screen bg-beige-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-3xl gradient-saudi flex items-center justify-center animate-pulse-soft">
            <span className="text-2xl font-bold text-white">د</span>
          </div>
          <div className="w-8 h-8 border-3 border-saudi-200 border-t-saudi-500 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return <LoginPage />;
  }

  // Onboarding flow
  if (!profile.financial_info_completed) {
    return <FinancialInfoPage onNext={() => {}} />;
  }

  if (!profile.goals_selected) {
    return <GoalsSelectionPage onNext={() => {}} />;
  }

  if (!profile.analysis_completed) {
    return <AIAnalysisPage onComplete={() => setPage('dashboard')} />;
  }

  // Main app
  return (
    <AppShell currentPage={page} onNavigate={setPage}>
      {page === 'dashboard' && <DashboardPage onNavigate={setPage} />}
      {page === 'recommendations' && <RecommendationsPage onNavigate={setPage} />}
      {page === 'budget' && <BudgetPlannerPage />}
      {page === 'goals' && <GoalsPage />}
      {page === 'reports' && <ReportsPage />}
      {page === 'assistant' && <AssistantPage />}
      {page === 'learning' && <LearningCenterPage onNavigate={setPage} />}
      {page === 'notifications' && <NotificationsPage />}
      {page === 'profile' && <ProfilePage onNavigate={setPage} />}
      {page === 'settings' && <SettingsPage />}
    </AppShell>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
