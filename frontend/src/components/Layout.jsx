import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import DashboardPage from '../pages/DashboardPage';
import EmployesPage from '../pages/EmployesPage';
import PointagePage from '../pages/PointagePage';
import CongesPage from '../pages/CongesPage';
import FichePaiePage from '../pages/FichePaiePage';
import UtilisateursPage from '../pages/UtilisateursPage';
import ParametresPage from '../pages/ParametresPage';

const PAGES = {
  '/': DashboardPage,
  '/employes': EmployesPage,
  '/pointage': PointagePage,
  '/conges': CongesPage,
  '/fiche-paie': FichePaiePage,
  '/utilisateurs': UtilisateursPage,
  '/parametres': ParametresPage,
};

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= 1024);
  const location = useLocation();
  const PageComponent = PAGES[location.pathname] || DashboardPage;

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const onChange = () => {
      if (mq.matches) setSidebarOpen(true);
      else setSidebarOpen(false);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-dark-950">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="page-enter">
            <PageComponent />
          </div>
        </main>
      </div>
    </div>
  );
}
