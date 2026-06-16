import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthContext';
import {
  LayoutDashboard,
  Plus,
  List,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Brain,
  KeyRound,
  Coins,
  User,
} from 'lucide-react';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/training/new', icon: Plus, label: 'New Training' },
  { to: '/requests', icon: List, label: 'Requests' },
  { to: '/credits', icon: Coins, label: 'Credits' },
];

const bottomItems = [
  { to: '/change-password', icon: KeyRound, label: 'Change Password' },
];

export default function Sidebar({ collapsed, onToggle }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <aside
      className={`fixed left-0 top-0 z-40 h-screen flex flex-col transition-all duration-300 ease-in-out
        ${collapsed ? 'w-[72px]' : 'w-64'}
        bg-white/90 dark:bg-dark-card/95 backdrop-blur-xl
        border-r border-black/5 dark:border-white/5`}
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-black/5 dark:border-white/5">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/25">
            <Brain className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <span className="text-lg font-bold gradient-text whitespace-nowrap animate-fade-in">
              Catalyst
            </span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto scrollbar-thin">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
              ${
                isActive
                  ? 'bg-primary/10 text-primary dark:bg-primary/15'
                  : 'text-dark/60 dark:text-surface-light/50 hover:bg-black/5 dark:hover:bg-white/5 hover:text-dark dark:hover:text-surface-light'
              }`
            }
          >
            <item.icon
              className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 group-hover:scale-110`}
            />
            {!collapsed && (
              <span className="whitespace-nowrap animate-fade-in">{item.label}</span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-black/5 dark:border-white/5 py-3 px-3 space-y-1">
        {bottomItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
              ${
                isActive
                  ? 'bg-primary/10 text-primary dark:bg-primary/15'
                  : 'text-dark/60 dark:text-surface-light/50 hover:bg-black/5 dark:hover:bg-white/5'
              }`
            }
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
          </NavLink>
        ))}

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium w-full
            text-danger/70 hover:bg-danger/10 hover:text-danger transition-all duration-200"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span className="whitespace-nowrap">Log out</span>}
        </button>

        {/* User info */}
        {!collapsed && user && (
          <div
            onClick={() => navigate('/credits')}
            className="flex items-center gap-3 px-3 py-3 mt-2 rounded-xl bg-black/3 dark:bg-white/5 animate-fade-in cursor-pointer hover:bg-black/5 dark:hover:bg-white/8 transition-colors"
          >
            <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-dark dark:text-surface-light truncate">
                {user.email}
              </p>
              <p className="text-[10px] text-dark/40 dark:text-surface-light/40 uppercase tracking-wider">
                {user.role || 'User'} • {user.credits ?? 0} credits
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full
          bg-white dark:bg-dark-card border border-black/10 dark:border-white/10
          flex items-center justify-center shadow-md hover:shadow-lg
          transition-all duration-200 hover:scale-110 z-50"
      >
        {collapsed ? (
          <ChevronRight className="w-3.5 h-3.5 text-dark/60 dark:text-surface-light/60" />
        ) : (
          <ChevronLeft className="w-3.5 h-3.5 text-dark/60 dark:text-surface-light/60" />
        )}
      </button>
    </aside>
  );
}
