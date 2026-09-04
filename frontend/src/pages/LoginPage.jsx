import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Sun, Moon, LogIn } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [locked, setLocked] = useState(false);
  const { login } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();

  const MAX_ATTEMPTS = 5;
  const LOCKOUT_MS = 30000;

  useEffect(() => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    sessionStorage.clear();
    document.body.style.userSelect = 'none';

    var loginUrl = window.location.href;

    var trap = function() {
      if (window.history.length > 1) {
        if (window.location.href !== loginUrl) {
          window.history.replaceState(null, '', loginUrl);
        }
        window.history.forward(1);
      }
    };

    window.history.pushState(null, '', loginUrl);
    window.history.pushState(null, '', loginUrl);
    window.history.pushState(null, '', loginUrl);
    window.history.pushState(null, '', loginUrl);
    window.history.pushState(null, '', loginUrl);
    window.history.pushState(null, '', loginUrl);

    var interval = setInterval(function() {
      window.history.pushState(null, '', window.location.href);
    }, 500);

    window.addEventListener('popstate', trap);
    window.addEventListener('hashchange', trap);

    var ticker = setInterval(function() {
      if (window.location.pathname !== '/login') {
        window.location.replace('/login');
      }
    }, 200);

    var onShow = function(e) {
      if (e.persisted) window.location.replace('/login');
    };
    window.addEventListener('pageshow', onShow);

    return function() {
      window.removeEventListener('popstate', trap);
      window.removeEventListener('hashchange', trap);
      window.removeEventListener('pageshow', onShow);
      clearInterval(interval);
      clearInterval(ticker);
      document.body.style.userSelect = '';
    };
  }, []);

  useEffect(() => {
    if (loginAttempts >= MAX_ATTEMPTS && !locked) {
      setLocked(true);
      toast.error('Trop de tentatives. Attendez 30 secondes.');
      const timer = setTimeout(() => {
        setLocked(false);
        setLoginAttempts(0);
      }, LOCKOUT_MS);
      return () => clearTimeout(timer);
    }
  }, [loginAttempts, locked]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (locked) return toast.error('Compte temporairement bloque');
    if (!username || !password) return toast.error('Veuillez remplir tous les champs');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { username, password });
      login({ username: data.username, nomComplet: data.nomComplet, role: data.role }, data.token);
      window.onpopstate = null;
      navigate('/', { replace: true });
    } catch (err) {
      setLoginAttempts(prev => prev + 1);
      const remaining = MAX_ATTEMPTS - loginAttempts - 1;
      const msg = err.response?.data?.error || 'Erreur de connexion';
      if (remaining > 0) {
        toast.error(`${msg} (${remaining} tentative${remaining > 1 ? 's' : ''} restante${remaining > 1 ? 's' : ''})`);
      } else {
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  }, [username, password, locked, loginAttempts, login, navigate]);

  return (
    <div className="min-h-screen flex select-none" onContextMenu={(e) => e.preventDefault()}>
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 to-primary-800 text-white p-12 flex-col justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">GESTION RH</h1>
          <p className="text-primary-200 text-lg">Pointage & Conge du personnel</p>
        </div>
        <div className="space-y-6">
          <div className="flex items-center gap-4 bg-white/10 rounded-xl p-4">
            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">⏰</div>
            <div><p className="font-semibold">Pointage en temps reel</p><p className="text-sm text-primary-200">Suivez les presences</p></div>
          </div>
          <div className="flex items-center gap-4 bg-white/10 rounded-xl p-4">
            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">📋</div>
            <div><p className="font-semibold">Gestion des conges</p><p className="text-sm text-primary-200">Solde et demandes</p></div>
          </div>
          <div className="flex items-center gap-4 bg-white/10 rounded-xl p-4">
            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">📄</div>
            <div><p className="font-semibold">Fiches de paie</p><p className="text-sm text-primary-200">Generation PDF</p></div>
          </div>
        </div>
        <p className="text-sm text-primary-300">© 2026 Gestion RH. Tous droits reserves.</p>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 bg-white dark:bg-dark-950 relative">
        <button onClick={toggle} className="absolute top-6 right-6 p-2 rounded-lg bg-gray-100 dark:bg-dark-800 hover:bg-gray-200 dark:hover:bg-dark-700">
          {dark ? <Sun size={18} className="text-yellow-500" /> : <Moon size={18} />}
        </button>

        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Connexion</h2>
          <p className="text-gray-500 dark:text-dark-400 mb-8">Connectez-vous a votre compte</p>

          {locked && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-600 dark:text-red-400">Trop de tentatives echouees. Reessayez dans 30 secondes.</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-1.5">Nom d'utilisateur</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false"
                disabled={locked}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-dark-700 bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none disabled:opacity-50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-1.5">Mot de passe</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
                  autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false"
                  disabled={locked}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-dark-700 bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none pr-10 disabled:opacity-50" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-dark-400 hover:text-gray-600">
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading || locked} className="w-full py-2.5 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors">
              <LogIn size={18} />
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>

            <button type="button" disabled={locked} onClick={() => { setUsername('admin'); setPassword(''); }} className="w-full py-2.5 border border-gray-300 dark:border-dark-700 text-gray-700 dark:text-dark-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-dark-800 transition-colors disabled:opacity-50">
              Se connecter en tant qu'administrateur
            </button>
          </form>

          <div className="mt-6 flex items-center justify-between text-sm">
            <Link to="/register" className="text-primary-600 hover:text-primary-700 dark:text-primary-400">Pas encore de compte? S'inscrire</Link>
            <Link to="/forgot-password" className="text-gray-500 dark:text-dark-400 hover:text-gray-700">Mot de passe oublie?</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
