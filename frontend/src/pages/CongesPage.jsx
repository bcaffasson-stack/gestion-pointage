import { useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, X, AlertTriangle } from 'lucide-react';

export default function CongesPage() {
  const [list, setList] = useState([]);
  const [employes, setEmployes] = useState([]);
  const [soldes, setSoldes] = useState([]);
  const [form, setForm] = useState({ numConge: '', numEmp: '', motif: '', nbrjr: 1, dateDemande: '', dateRetour: '' });
  const [editId, setEditId] = useState(null);
  const [annee] = useState(new Date().getFullYear());

  const load = () => api.get('/conges').then(r => setList(r.data)).catch(() => {});
  const loadEmp = () => api.get('/employes').then(r => setEmployes(r.data)).catch(() => {});
  const loadSoldes = () => api.get(`/conges/solde?annee=${annee}`).then(r => setSoldes(r.data)).catch(() => {});
  useEffect(() => { load(); loadEmp(); loadSoldes(); }, []);

  const update = (k, v) => setForm({ ...form, [k]: v });

  const empName = (numEmp) => {
    const e = employes.find(x => x.numEmp === numEmp);
    return e ? `${e.nom} ${e.prenom}` : numEmp;
  };

  const save = async () => {
    if (!form.numConge || !form.numEmp || !form.motif || !form.nbrjr || !form.dateDemande || !form.dateRetour) return toast.error('Tous les champs sont requis');
    try {
      const payload = { ...form, nbrjr: parseInt(form.nbrjr) };
      if (editId) {
        await api.put(`/conges/${editId}`, payload);
        toast.success('Conge modifie');
      } else {
        await api.post('/conges', payload);
        toast.success('Conge ajoute');
      }
      setForm({ numConge: '', numEmp: '', motif: '', nbrjr: 1, dateDemande: '', dateRetour: '' }); setEditId(null); load(); loadSoldes();
    } catch (err) { toast.error(err.response?.data?.error || 'Erreur'); }
  };

  const del = async (id) => {
    if (!confirm('Supprimer ce conge?')) return;
    try { await api.delete(`/conges/${id}`); toast.success('Supprime'); load(); loadSoldes(); } catch (e) { toast.error('Erreur'); }
  };

  const edit = (c) => {
    setForm({ numConge: c.numConge, numEmp: c.numEmp, motif: c.motif, nbrjr: c.nbrjr, dateDemande: c.dateDemande, dateRetour: c.dateRetour });
    setEditId(c.numConge);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Conges</h1>

      <div className="bg-white dark:bg-dark-900 rounded-xl p-6 border border-gray-200 dark:border-dark-800">
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          <input placeholder="Num Conge" value={form.numConge} onChange={e => update('numConge', e.target.value)} disabled={!!editId}
            className="px-3 py-2 rounded-lg border border-gray-300 dark:border-dark-700 bg-white dark:bg-dark-800 text-gray-900 dark:text-white text-sm disabled:opacity-50 outline-none focus:ring-2 focus:ring-primary-500" />
          <select value={form.numEmp} onChange={e => update('numEmp', e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-300 dark:border-dark-700 bg-white dark:bg-dark-800 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-primary-500">
            <option value="">Employe</option>
            {employes.map(e => <option key={e.numEmp} value={e.numEmp}>{e.nom} {e.prenom}</option>)}
          </select>
          <input placeholder="Motif" value={form.motif} onChange={e => update('motif', e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-300 dark:border-dark-700 bg-white dark:bg-dark-800 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-primary-500" />
          <input placeholder="Nb jours" type="number" min="1" max="365" value={form.nbrjr} onChange={e => update('nbrjr', e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-300 dark:border-dark-700 bg-white dark:bg-dark-800 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-primary-500" />
          <input type="date" value={form.dateDemande} onChange={e => update('dateDemande', e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-300 dark:border-dark-700 bg-white dark:bg-dark-800 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-primary-500" />
          <input type="date" value={form.dateRetour} onChange={e => update('dateRetour', e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-300 dark:border-dark-700 bg-white dark:bg-dark-800 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-primary-500" />
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={save} className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium flex items-center gap-1">
            <Plus size={16} /> {editId ? 'Modifier' : 'Ajouter'}
          </button>
          {editId && <button onClick={() => { setForm({ numConge: '', numEmp: '', motif: '', nbrjr: 1, dateDemande: '', dateRetour: '' }); setEditId(null); }} className="p-2 text-gray-400 dark:text-dark-400 hover:text-gray-600"><X size={18} /></button>}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-dark-900 rounded-xl border border-gray-200 dark:border-dark-800 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-dark-800">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-dark-400 uppercase">Num</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-dark-400 uppercase">Employe</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-dark-400 uppercase">Motif</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-dark-400 uppercase">Jours</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-dark-400 uppercase">Demande</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-dark-400 uppercase">Retour</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-dark-400 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-dark-800">
            {list.map(c => (
              <tr key={c.numConge} className="hover:bg-gray-50 dark:hover:bg-dark-800/50">
                <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{c.numConge}</td>
                <td className="px-4 py-3 text-gray-700 dark:text-dark-300">{empName(c.numEmp)}</td>
                <td className="px-4 py-3 text-gray-700 dark:text-dark-300">{c.motif}</td>
                <td className="px-4 py-3 text-gray-700 dark:text-dark-300">{c.nbrjr}j</td>
                <td className="px-4 py-3 text-gray-700 dark:text-dark-300">{c.dateDemande}</td>
                <td className="px-4 py-3 text-gray-700 dark:text-dark-300">{c.dateRetour}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => edit(c)} className="p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg mr-1"><Pencil size={15} /></button>
                  <button onClick={() => del(c.numConge)} className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"><Trash2 size={15} /></button>
                </td>
              </tr>
            ))}
            {list.length === 0 && <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400 dark:text-dark-400">Aucun conge</td></tr>}
          </tbody>
        </table>
      </div>

      {/* Soldes */}
      <div className="bg-white dark:bg-dark-900 rounded-xl p-6 border border-gray-200 dark:border-dark-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Solde conges ({annee})</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-dark-800">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-dark-400 uppercase">Num</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-dark-400 uppercase">Nom</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-dark-400 uppercase">Pris</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-dark-400 uppercase">Solde</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-dark-400 uppercase">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-dark-800">
              {soldes.map(s => (
                <tr key={s.numEmp}>
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{s.numEmp}</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-dark-300">{s.nomComplet}</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-dark-300">{s.totalPris}j</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-dark-300">{s.solde}j</td>
                  <td className="px-4 py-3">
                    {s.depasse ? (
                      <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 font-medium">
                        <AlertTriangle size={12} /> Depasse de {Math.abs(s.solde)}j
                      </span>
                    ) : (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 font-medium">OK</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
