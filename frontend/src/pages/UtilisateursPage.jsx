import { useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { Save, Key, UserCog } from 'lucide-react';

export default function UtilisateursPage() {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState({ username: '', nomComplet: '', email: '' });
  const [pass, setPass] = useState({ newPassword: '', confirm: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/users/me')
      .then(r => {
        const d = r.data;
        setProfile({ username: d.username || '', nomComplet: d.nomComplet || '', email: d.email || '' });
      })
      .catch(() => {});
  }, []);

  const saveProfile = async () => {
    if (!profile.email) return toast.error('Email requis');
    try {
      setSaving(true);
      const { data } = await api.put('/users/me', { email: profile.email, nomComplet: profile.nomComplet });
      updateUser({ nomComplet: data.nomComplet, email: data.email });
      toast.success('Profil mis a jour');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erreur');
    } finally {
      setSaving(false);
    }
  };

  const changePass = async () => {
    if (!pass.newPassword || pass.newPassword.length < 4) return toast.error('Le mot de passe doit contenir au moins 4 caracteres');
    if (pass.newPassword !== pass.confirm) return toast.error('Les mots de passe ne correspondent pas');
    try {
      await api.put('/users/me/password', { newPassword: pass.newPassword });
      setPass({ newPassword: '', confirm: '' });
      toast.success('Mot de passe modifie');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erreur');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mon compte</h1>

      <div className="bg-white dark:bg-dark-900 rounded-xl p-6 border border-gray-200 dark:border-dark-800">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold text-lg">
            {profile.nomComplet?.charAt(0) || (profile.username && profile.username.charAt(0).toUpperCase()) || 'A'}
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{profile.nomComplet || 'Mon compte'}</p>
            <p className="text-sm text-gray-400 dark:text-dark-400">@{profile.username}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-1">Nom complet</label>
            <input value={profile.nomComplet} onChange={e => setProfile({ ...profile, nomComplet: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-dark-700 bg-white dark:bg-dark-800 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-1">Email</label>
            <input type="email" value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-dark-700 bg-white dark:bg-dark-800 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
        </div>
        <button onClick={saveProfile} disabled={saving}
          className="px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium flex items-center gap-1">
          <Save size={16} /> {saving ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>

      <div className="bg-white dark:bg-dark-900 rounded-xl p-6 border border-gray-200 dark:border-dark-800">
        <div className="flex items-center gap-2 mb-4">
          <Key size={18} className="text-amber-500" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Changer le mot de passe</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-1">Nouveau mot de passe</label>
            <input type="password" value={pass.newPassword} onChange={e => setPass({ ...pass, newPassword: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-dark-700 bg-white dark:bg-dark-800 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-1">Confirmer le mot de passe</label>
            <input type="password" value={pass.confirm} onChange={e => setPass({ ...pass, confirm: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-dark-700 bg-white dark:bg-dark-800 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
        </div>
        <button onClick={changePass}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-medium flex items-center gap-1">
          <UserCog size={16} /> Changer le mot de passe
        </button>
      </div>
    </div>
  );
}
