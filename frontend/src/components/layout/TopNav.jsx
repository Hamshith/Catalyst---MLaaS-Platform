import { useLocation } from 'react-router-dom';
import { useTheme } from './ThemeProvider';
import { Sun, Moon, Menu } from 'lucide-react';

const routeNames = {
  '/': 'Dashboard',
  '/training/new': 'New Training Request',
  '/requests': 'Training Requests',
  '/credits': 'Credits',
  '/change-password': 'Change Password',
};

export default function TopNav({ onMenuClick }) {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const currentRoute =
    routeNames[location.pathname] ||
    (location.pathname.startsWith('/requests/') ? 'Request Details' : 'Catalyst');

  return (
    <header
      className="sticky top-0 z-30 h-16 flex items-center justify-between px-6
        bg-white/80 dark:bg-dark-card/80 backdrop-blur-xl
        border-b border-black/5 dark:border-white/5"
    >
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        >
          <Menu className="w-5 h-5 text-dark/70 dark:text-surface-light/70" />
        </button>
        <div>
          <h1 className="text-lg font-semibold text-dark dark:text-surface-light">
            {currentRoute}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10
            transition-all duration-200 hover:scale-105"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? (
            <Moon className="w-4.5 h-4.5 text-dark/70" />
          ) : (
            <Sun className="w-4.5 h-4.5 text-secondary" />
          )}
        </button>
      </div>
    </header>
  );
}
