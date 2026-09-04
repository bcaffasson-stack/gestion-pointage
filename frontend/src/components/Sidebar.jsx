import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Users, Clock, CalendarOff, FileText, UserCog, Settings, LogOut, X } from 'lucide-react';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Tableau de bord' },
  { to: '/employes', icon: Users, label: 'Employes' },
  { to: '/pointage', icon: Clock, label: 'Pointage' },
  { to: '/conges', icon: CalendarOff, label: 'Conges' },
  { to: '/fiche-paie', icon: FileText, label: 'Fiche de paie' },
];

const settingsItems = [
  { to: '/utilisateurs', icon: UserCog, label: 'Mon compte' },
  { to: '/parametres', icon: Settings, label: 'Parametres' },
];

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const handleNavClick = () => {
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
      isActive
        ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/25'
        : 'text-gray-600 dark:text-dark-400 hover:bg-gray-100 dark:hover:bg-dark-800 hover:text-gray-900 dark:hover:text-white'
    }`;

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white dark:bg-dark-900 border-r border-gray-200 dark:border-dark-800 transform transition-transform duration-200 ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-0 lg:overflow-hidden'}`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-dark-800">
          <div>
            <h1 className="text-sm font-bold text-primary-600 dark:text-primary-400">GESTION RH</h1>
            <p className="text-xs text-gray-400 dark:text-dark-500">Pointage & Conge</p>
          </div>
          <button onClick={onClose} className="lg:hidden text-gray-400 dark:text-dark-400 hover:text-gray-600"><X size={20} /></button>
        </div>

        <nav className="p-4 space-y-1">
          <p className="px-4 text-xs font-semibold text-gray-400 dark:text-dark-500 uppercase tracking-wider mb-2">Menu principal</p>
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === '/'} className={linkClass} onClick={handleNavClick}>
              <item.icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          ))}

          <p className="px-4 text-xs font-semibold text-gray-400 dark:text-dark-500 uppercase tracking-wider mt-6 mb-2">Parametres</p>
          {settingsItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={linkClass} onClick={handleNavClick}>
              <item.icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-dark-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-primary-600 flex items-center justify-center text-white text-sm font-bold">
              {user?.nomComplet?.charAt(0) || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user?.nomComplet || 'Admin'}</p>
              <p className="text-xs text-gray-400 dark:text-dark-500">{user?.role || 'Administrateur'}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
            <LogOut size={16} />
            Deconnexion
          </button>
        </div>
      </aside>
    </>
  );
}
