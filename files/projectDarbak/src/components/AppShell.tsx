import { useState } from 'react';
import { useAuth } from '../lib/auth';
import { Wallet, LayoutDashboard, Sparkles, Wallet as WalletIcon, Target, Receipt, Brain, BookOpen, Bell, User, Settings as SettingsIcon, LogOut, Menu, X, ChevronLeft } from 'lucide-react';

export type Page =
  | 'dashboard'
  | 'recommendations'
  | 'budget'
  | 'goals'
  | 'reports'
  | 'assistant'
  | 'learning'
  | 'notifications'
  | 'profile'
  | 'settings';

const navItems: { id: Page; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'لوحة التحكم', icon: LayoutDashboard },
  { id: 'recommendations', label: 'التوصيات الذكية', icon: Sparkles },
  { id: 'budget', label: 'مخطط الميزانية', icon: WalletIcon },
  { id: 'goals', label: 'الأهداف المالية', icon: Target },
  { id: 'reports', label: 'التقارير الشهرية', icon: Receipt },
  { id: 'assistant', label: 'المساعد الذكي', icon: Brain },
  { id: 'learning', label: 'مركز التعلم', icon: BookOpen },
  { id: 'notifications', label: 'الإشعارات', icon: Bell },
  { id: 'profile', label: 'الملف الشخصي', icon: User },
  { id: 'settings', label: 'الإعدادات', icon: SettingsIcon },
];

export function AppShell({ currentPage, onNavigate, children }: { currentPage: Page; onNavigate: (page: Page) => void; children: React.ReactNode }) {
  const { profile, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileMenu, setProfileMenu] = useState(false);

  const currentLabel = navItems.find(n => n.id === currentPage)?.label || '';

  const handleNavigate = (page: Page) => {
    onNavigate(page);
    setMobileOpen(false);
  };

  return (
    <div className="min-h-screen bg-beige-100 flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-72 bg-white border-l border-gray-100 fixed right-0 top-0 bottom-0 z-30">
        {/* Logo */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl gradient-saudi flex items-center justify-center">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-saudi-500">دربك المالي</h1>
              <p className="text-xs text-gray-400">مساعدك المالي الذكي</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 scrollbar-hide">
          <div className="space-y-1">
            {navItems.map(item => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigate(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 no-tap-highlight ${
                    isActive
                      ? 'gradient-saudi text-white shadow-soft-lg'
                      : 'text-gray-600 hover:bg-beige-50'
                  }`}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-semibold">{item.label}</span>
                  {isActive && <ChevronLeft className="w-4 h-4 mr-auto" />}
                </button>
              );
            })}
          </div>
        </nav>

        {/* User card */}
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={signOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-semibold">تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm animate-fade-in" onClick={() => setMobileOpen(false)} />
          <aside className="absolute right-0 top-0 bottom-0 w-72 bg-white animate-slide-in flex flex-col">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl gradient-saudi flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-saudi-500">دربك المالي</h1>
                  <p className="text-xs text-gray-400">مساعدك المالي الذكي</p>
                </div>
              </div>
              <button onClick={() => setMobileOpen(false)} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto p-4 scrollbar-hide">
              <div className="space-y-1">
                {navItems.map(item => {
                  const isActive = currentPage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavigate(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
                        isActive ? 'gradient-saudi text-white' : 'text-gray-600 hover:bg-beige-50'
                      }`}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      <span className="text-sm font-semibold">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </nav>
            <div className="p-4 border-t border-gray-100">
              <button onClick={signOut} className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-red-500 hover:bg-red-50 transition-colors">
                <LogOut className="w-5 h-5" />
                <span className="text-sm font-semibold">تسجيل الخروج</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 lg:mr-72 min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-beige-100/80 backdrop-blur-lg border-b border-gray-100 px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-soft"
              >
                <Menu className="w-5 h-5 text-saudi-500" />
              </button>
              <div>
                <h2 className="text-lg font-bold text-ink-900">{currentLabel}</h2>
              </div>
            </div>

            {/* Profile avatar */}
            <div className="relative">
              <button
                onClick={() => setProfileMenu(!profileMenu)}
                className="flex items-center gap-2 p-1 pr-3 rounded-2xl hover:bg-white transition-colors"
              >
                <div className="w-9 h-9 rounded-xl gradient-saudi flex items-center justify-center text-white text-sm font-bold">
                  {profile?.full_name?.charAt(0) || 'م'}
                </div>
                <span className="text-sm font-semibold text-ink-900 hidden sm:block">{profile?.full_name?.split(' ')[0] || 'مستخدم'}</span>
              </button>
              {profileMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setProfileMenu(false)} />
                  <div className="absolute left-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-soft-xl p-2 z-20 animate-scale-in">
                    <button onClick={() => { handleNavigate('profile'); setProfileMenu(false); }} className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-beige-50 text-right text-sm text-gray-600">
                      <User className="w-4 h-4" /> الملف الشخصي
                    </button>
                    <button onClick={() => { handleNavigate('settings'); setProfileMenu(false); }} className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-beige-50 text-right text-sm text-gray-600">
                      <SettingsIcon className="w-4 h-4" /> الإعدادات
                    </button>
                    <button onClick={signOut} className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-red-50 text-right text-sm text-red-500">
                      <LogOut className="w-4 h-4" /> تسجيل الخروج
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-8 max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
