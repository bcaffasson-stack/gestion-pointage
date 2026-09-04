import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Database, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ParametresPage() {
  const { dark, toggle } = useTheme();

  const saveTheme = () => {
    toast.success('Theme sauvegarde');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Parametres</h1>

      {/* Theme */}
      <div className="bg-white dark:bg-dark-900 rounded-xl p-6 border border-gray-200 dark:border-dark-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          {dark ? <Moon size={20} /> : <Sun size={20} />}
          Apparence
        </h3>
        <div className="flex gap-3">
          <button onClick={() => { if (!dark) toggle(); }} className={`px-4 py-3 rounded-lg border-2 transition-all flex items-center gap-2 ${!dark ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400' : 'border-gray-200 dark:border-dark-700 hover:border-gray-300'}`}>
            <Sun size={18} /> Theme clair
          </button>
          <button onClick={() => { if (dark) toggle(); }} className={`px-4 py-3 rounded-lg border-2 transition-all flex items-center gap-2 ${dark ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400' : 'border-gray-200 dark:border-dark-700 hover:border-gray-300'}`}>
            <Moon size={18} /> Theme sombre
          </button>
        </div>
      </div>

      {/* Database info */}
      <div className="bg-white dark:bg-dark-900 rounded-xl p-6 border border-gray-200 dark:border-dark-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Database size={20} />
          Base de donnees
        </h3>
        <div className="space-y-3 text-sm text-gray-600 dark:text-dark-400">
          <p><span className="font-medium text-gray-900 dark:text-white">Type:</span> PostgreSQL</p>
          <p><span className="font-medium text-gray-900 dark:text-white">URL:</span> jdbc:postgresql://localhost:5432/pointage_db</p>
          <p><span className="font-medium text-gray-900 dark:text-white">Statut:</span> <span className="text-green-500">Connecte</span></p>
        </div>
      </div>

      {/* About */}
      <div className="bg-white dark:bg-dark-900 rounded-xl p-6 border border-gray-200 dark:border-dark-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">A propos</h3>
        <div className="space-y-2 text-sm text-gray-600 dark:text-dark-400">
          <p><span className="font-medium text-gray-900 dark:text-white">Application:</span> Gestion de Pointage et Conge</p>
          <p><span className="font-medium text-gray-900 dark:text-white">Version:</span> 2.0.0 (Web)</p>
          <p><span className="font-medium text-gray-900 dark:text-white">Backend:</span> Spring Boot</p>
          <p><span className="font-medium text-gray-900 dark:text-white">Frontend:</span> React + Tailwind CSS</p>
        </div>
      </div>
    </div>
  );
}
