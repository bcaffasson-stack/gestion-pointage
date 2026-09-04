import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { FileDown } from 'lucide-react';

const MOIS = ['Janvier','Fevrier','Mars','Avril','Mai','Juin','Juillet','Aout','Septembre','Octobre','Novembre','Decembre'];

export default function FichePaiePage() {
  const [employes, setEmployes] = useState([]);
  const [emp, setEmp] = useState('');
  const [mois, setMois] = useState(MOIS[new Date().getMonth()]);
  const [annee, setAnnee] = useState(new Date().getFullYear().toString());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    var token = localStorage.getItem('token');
    if (!token) return;
    fetch('/api/employes', { headers: { Authorization: 'Bearer ' + token } })
      .then(function(r) { return r.ok ? r.json() : []; })
      .then(function(data) { setEmployes(data); })
      .catch(function() {});
  }, []);

  var generate = function() {
    if (!emp) return toast.error('Selectionnez un employe');
    setLoading(true);
    var token = localStorage.getItem('token');
    var url = '/api/fiche-paie/generate?emp=' + emp + '&mois=' + mois + '&annee=' + annee + '&token=' + encodeURIComponent(token);
    window.open(url, '_blank');
    setTimeout(function() { setLoading(false); toast.success('PDF ouvert dans un nouvel onglet'); }, 1000);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Fiche de paie</h1>
      <div className="bg-white dark:bg-dark-900 rounded-xl p-6 border border-gray-200 dark:border-dark-800 max-w-xl">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-1">Employe</label>
            <select value={emp} onChange={function(e) { setEmp(e.target.value); }}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-dark-700 bg-white dark:bg-dark-800 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-primary-500">
              <option value="">Selectionner un employe</option>
              {employes.map(function(e) { return <option key={e.numEmp} value={e.numEmp}>{e.nom} {e.prenom} ({e.numEmp})</option>; })}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-1">Mois</label>
              <select value={mois} onChange={function(e) { setMois(e.target.value); }}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-dark-700 bg-white dark:bg-dark-800 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-primary-500">
                {MOIS.map(function(m) { return <option key={m} value={m}>{m}</option>; })}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-1">Annee</label>
              <input type="number" value={annee} onChange={function(e) { setAnnee(e.target.value); }}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-dark-700 bg-white dark:bg-dark-800 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
          </div>
          <button onClick={generate} disabled={loading || !emp}
            className="w-full py-2.5 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white rounded-lg font-medium flex items-center justify-center gap-2">
            <FileDown size={18} />
            {loading ? 'Generation...' : 'Generer le PDF'}
          </button>
        </div>
      </div>
    </div>
  );
}
