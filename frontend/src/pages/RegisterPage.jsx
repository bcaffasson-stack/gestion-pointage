import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Sun, Moon, UserPlus, ArrowLeft } from 'lucide-react';

export default function RegisterPage() {
  const [form, setForm] = useState({ username: '', email: '', nomComplet: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();

  const update = (field, value) => setForm({ ...form, [field]: value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.email || !form.nomComplet || !form.password) return toast.error('Tous les champs sont requis');
    if (form.password.length < 4) return toast.error('Le mot de passe doit contenir au moins 4 caracteres');
    if (form.password !== form.confirm) return toast.error('Les mots de passe ne correspondent pas');

    setLoading(true);
    try {
      await api.post('/auth/register', form);
      toast.success('Compte cree avec succes');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.error || "Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-950 p-4 relative">
      <button onClick={toggle} className="absolute top-6 right-6 p-2 rounded-lg bg-white dark:bg-dark-800 shadow hover:bg-gray-100 dark:hover:bg-dark-700">
        {dark ? <Sun size={18} className="text-yellow-500" /> : <Moon size={18} />}
      </button>

      <div className="w-full max-w-md bg-white dark:bg-dark-900 rounded-2xl shadow-xl p-8">
        <Link to="/login" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:text-dark-400 mb-6"><ArrowLeft size={16} /> Retour</Link>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Inscription</h2>
        <p className="text-gray-500 dark:text-dark-400 mb-6">Creez votre compte</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { key: 'nomComplet', label: 'Nom complet', type: 'text', placeholder: 'Jean Dupont' },
            { key: 'email', label: 'Email', type: 'email', placeholder: 'jean@email.com' },
            { key: 'username', label: "Nom d'utilisateur", type: 'text', placeholder: 'jeandupont' },
          ].map(({ key, label, type, placeholder }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-1">{label}</label>
              <input type={type} placeholder={placeholder} value={form[key]} onChange={(e) => update(key, e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-dark-700 bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none" />
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-1">Mot de passe</label>
            <div className="relative">
              <input type={showPass ? 'text' : 'password'} placeholder="Min. 4 caracteres" value={form.password} onChange={(e) => update('password', e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-dark-700 bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none pr-10" />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-dark-400">
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-1">Confirmer</label>
            <input type={showPass ? 'text' : 'password'} placeholder="Confirmez le mot de passe" value={form.confirm} onChange={(e) => update('confirm', e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-dark-700 bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none" />
          </div>

          <button type="submit" disabled={loading} className="w-full py-2.5 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white rounded-lg font-medium flex items-center justify-center gap-2">
            <UserPlus size={18} />
            {loading ? 'Creation...' : "S'inscrire"}
          </button>
        </form>
      </div>
    </div>
  );
}
