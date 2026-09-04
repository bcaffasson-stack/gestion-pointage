import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Menu, Sun, Moon } from 'lucide-react';

export default function Topbar({ onMenuToggle }) {
  const { dark, toggle } = useTheme();
  const { user } = useAuth();
  const today = new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <header className="h-16 bg-white dark:bg-dark-900 border-b border-gray-200 dark:border-dark-800 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <button onClick={onMenuToggle} className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-dark-400">
          <Menu size={22} />
        </button>
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Bonjour, {user?.nomComplet?.split(' ')[0] || 'Admin'}</h2>
          <p className="text-xs text-gray-400 dark:text-dark-500 capitalize">{today}</p>
        </div>
      </div>
      <button onClick={toggle} className="p-2 rounded-lg bg-gray-100 dark:bg-dark-800 hover:bg-gray-200 dark:hover:bg-dark-700 transition-colors">
        {dark ? <Sun size={18} className="text-yellow-500" /> : <Moon size={18} className="text-dark-600" />}
      </button>
    </header>
  );
}
