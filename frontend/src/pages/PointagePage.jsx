import { useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, X } from 'lucide-react';

export default function PointagePage() {
  const [list, setList] = useState([]);
  const [employes, setEmployes] = useState([]);
  const [absents, setAbsents] = useState([]);
  const [form, setForm] = useState({ datePointage: '', numEmp: '', pointage: 'oui' });
  const [editKey, setEditKey] = useState(null);
  const [dateAbsents, setDateAbsents] = useState(new Date().toISOString().split('T')[0]);

  const load = () => api.get('/pointages').then(r => setList(r.data)).catch(() => {});
  const loadEmp = () => api.get('/employes').then(r => setEmployes(r.data)).catch(() => {});
  useEffect(() => { load(); loadEmp(); }, []);

  const empName = (numEmp) => {
    const e = employes.find(x => x.numEmp === numEmp);
    return e ? `${e.nom} ${e.prenom}` : numEmp;
  };

  const update = (k, v) => setForm({ ...form, [k]: v });

  const save = async () => {
    if (!form.datePointage || !form.numEmp) return toast.error('Date et employe requis');
    try {
      if (editKey) {
        await api.put('/pointages', { ...form, ancienEtat: editKey.ancienEtat });
        toast.success('Pointage modifie');
      } else {
        await api.post('/pointages', form);
        toast.success('Pointage ajoute');
      }
      setForm({ datePointage: '', numEmp: '', pointage: 'oui' }); setEditKey(null); load();
    } catch (err) { toast.error(err.response?.data?.error || 'Erreur'); }
  };

  const del = async (date, numEmp) => {
    if (!confirm('Supprimer ce pointage?')) return;
    try { await api.delete(`/pointages/${date}/${numEmp}`); toast.success('Supprime'); load(); } catch (e) { toast.error('Erreur'); }
  };

  const edit = (p) => {
    setForm({ datePointage: p.datePointage, numEmp: p.numEmp, pointage: p.pointage });
    setEditKey({ ancienEtat: p.pointage });
  };

  const loadAbsents = async () => {
    try { const r = await api.get(`/pointages/absents?date=${dateAbsents}`); setAbsents(r.data); } catch (e) {}
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Pointage</h1>

      <div className="bg-white dark:bg-dark-900 rounded-xl p-6 border border-gray-200 dark:border-dark-800">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <input type="date" value={form.datePointage} onChange={e => update('datePointage', e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-300 dark:border-dark-700 bg-white dark:bg-dark-800 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-primary-500" />
          <select value={form.numEmp} onChange={e => update('numEmp', e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-300 dark:border-dark-700 bg-white dark:bg-dark-800 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-primary-500">
            <option value="">Selectionner employe</option>
            {employes.map(e => <option key={e.numEmp} value={e.numEmp}>{e.nom} {e.prenom}</option>)}
          </select>
          <select value={form.pointage} onChange={e => update('pointage', e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-300 dark:border-dark-700 bg-white dark:bg-dark-800 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-primary-500">
            <option value="oui">Present (oui)</option>
            <option value="non">Absent (non)</option>
          </select>
          <div className="flex gap-2">
            <button onClick={save} className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium flex items-center gap-1">
              <Plus size={16} /> {editKey ? 'Modifier' : 'Ajouter'}
            </button>
            {editKey && <button onClick={() => { setForm({ datePointage: '', numEmp: '', pointage: 'oui' }); setEditKey(null); }} className="p-2 text-gray-400 dark:text-dark-400 hover:text-gray-600"><X size={18} /></button>}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-dark-900 rounded-xl border border-gray-200 dark:border-dark-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-dark-800">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-dark-400 uppercase">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-dark-400 uppercase">Num Emp</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-dark-400 uppercase">Employe</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-dark-400 uppercase">Etat</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-dark-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-dark-800">
              {list.map((p, i) => (
                <tr key={i} className="hover:bg-gray-50 dark:hover:bg-dark-800/50">
                  <td className="px-4 py-3 text-gray-700 dark:text-dark-300">{p.datePointage}</td>
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{p.numEmp}</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-dark-300">{empName(p.numEmp)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.pointage === 'oui' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                      {p.pointage === 'oui' ? 'Present' : 'Absent'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => edit(p)} className="p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg mr-1"><Pencil size={15} /></button>
                    <button onClick={() => del(p.datePointage, p.numEmp)} className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"><Trash2 size={15} /></button>
                  </td>
                </tr>
              ))}
              {list.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400 dark:text-dark-400">Aucun pointage</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {/* Absents */}
      <div className="bg-white dark:bg-dark-900 rounded-xl p-6 border border-gray-200 dark:border-dark-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Liste des absents</h3>
        <div className="flex gap-2 mb-4">
          <input type="date" value={dateAbsents} onChange={e => setDateAbsents(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-300 dark:border-dark-700 bg-white dark:bg-dark-800 text-gray-900 dark:text-white text-sm outline-none" />
          <button onClick={loadAbsents} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium">Afficher absents</button>
        </div>
        {absents.length > 0 && (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-dark-800">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-dark-400 uppercase">Num</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-dark-400 uppercase">Employe</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-dark-400 uppercase">Poste</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-dark-800">
              {absents.map((a, i) => {
                const e = employes.find(x => x.numEmp === a.numEmp);
                return (
                  <tr key={i}>
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{a.numEmp}</td>
                    <td className="px-4 py-3 text-gray-700 dark:text-dark-300">{e ? `${e.nom} ${e.prenom}` : a.numEmp}</td>
                    <td className="px-4 py-3 text-gray-700 dark:text-dark-300">{e ? e.poste : ''}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
