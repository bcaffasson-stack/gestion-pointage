import { useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, Search, X } from 'lucide-react';

const empty = { numEmp: '', nom: '', prenom: '', poste: '', salaire: '' };

export default function EmployesPage() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState(empty);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  const load = () => api.get('/employes').then(r => setList(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const update = (k, v) => setForm({ ...form, [k]: v });

  // Meme regle que la version desktop (MainController.limiterAlphabetique):
  // lettres unicode (accents inclus), espaces, tirets et apostrophes uniquement
  const updateAlpha = (k, v) => {
    if (/^[\p{L} \-']*$/u.test(v)) {
      setForm({ ...form, [k]: v });
    } else {
      toast.error('Lettres et accents uniquement !');
    }
  };

  const save = async () => {
    if (!form.numEmp || !form.nom || !form.prenom || !form.poste || !form.salaire) return toast.error('Tous les champs sont requis');
    try {
      if (selected) {
        await api.put(`/employes/${selected}`, { ...form, salaire: parseInt(form.salaire) });
        toast.success('Employe modifie');
      } else {
        await api.post('/employes', { ...form, salaire: parseInt(form.salaire) });
        toast.success('Employe ajoute');
      }
      setForm(empty); setSelected(null); load();
    } catch (err) { toast.error(err.response?.data?.error || 'Erreur'); }
  };

  const del = async (id) => {
    if (!confirm('Supprimer cet employe?')) return;
    try { await api.delete(`/employes/${id}`); toast.success('Supprime'); load(); } catch (e) { toast.error('Erreur'); }
  };

  const edit = (e) => { setForm(e); setSelected(e.numEmp); };

  const handleSearch = async () => {
    if (!search) return load();
    try { const r = await api.get(`/employes/search?q=${search}`); setList(r.data); } catch (e) {}
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Employes</h1>

      {/* Form */}
      <div className="bg-white dark:bg-dark-900 rounded-xl p-6 border border-gray-200 dark:border-dark-800">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <input placeholder="Num EMP" value={form.numEmp} onChange={e => update('numEmp', e.target.value)} disabled={!!selected}
            className="px-3 py-2 rounded-lg border border-gray-300 dark:border-dark-700 bg-white dark:bg-dark-800 text-gray-900 dark:text-white text-sm disabled:opacity-50 outline-none focus:ring-2 focus:ring-primary-500" />
          <input placeholder="Nom" value={form.nom} onChange={e => updateAlpha('nom', e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-300 dark:border-dark-700 bg-white dark:bg-dark-800 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-primary-500" />
          <input placeholder="Prenom" value={form.prenom} onChange={e => updateAlpha('prenom', e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-300 dark:border-dark-700 bg-white dark:bg-dark-800 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-primary-500" />
          <input placeholder="Poste" value={form.poste} onChange={e => update('poste', e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-300 dark:border-dark-700 bg-white dark:bg-dark-800 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-primary-500" />
          <input placeholder="Salaire" type="number" value={form.salaire} onChange={e => update('salaire', e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-300 dark:border-dark-700 bg-white dark:bg-dark-800 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-primary-500" />
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={save} className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium flex items-center gap-1">
            <Plus size={16} /> {selected ? 'Modifier' : 'Ajouter'}
          </button>
          {selected && <button onClick={() => { setForm(empty); setSelected(null); }} className="px-4 py-2 border border-gray-300 dark:border-dark-700 text-gray-700 dark:text-dark-300 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-dark-800">Annuler</button>}
        </div>
      </div>

      {/* Search + Table */}
      <div className="bg-white dark:bg-dark-900 rounded-xl border border-gray-200 dark:border-dark-800 overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-dark-800 flex gap-2">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-dark-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="Rechercher un employe..."
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 dark:border-dark-700 bg-white dark:bg-dark-800 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <button onClick={handleSearch} className="px-4 py-2 bg-gray-100 dark:bg-dark-800 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-dark-700">Rechercher</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-dark-800">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-dark-400 uppercase">Num</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-dark-400 uppercase">Nom</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-dark-400 uppercase">Prenom</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-dark-400 uppercase">Poste</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-dark-400 uppercase">Salaire</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-dark-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-dark-800">
              {list.map(e => (
                <tr key={e.numEmp} className="hover:bg-gray-50 dark:hover:bg-dark-800/50">
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{e.numEmp}</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-dark-300">{e.nom}</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-dark-300">{e.prenom}</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-dark-300">{e.poste}</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-dark-300">{e.salaire?.toLocaleString()} Ar</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => edit(e)} className="p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg mr-1"><Pencil size={15} /></button>
                    <button onClick={() => del(e.numEmp)} className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"><Trash2 size={15} /></button>
                  </td>
                </tr>
              ))}
              {list.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400 dark:text-dark-400">Aucun employe</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
