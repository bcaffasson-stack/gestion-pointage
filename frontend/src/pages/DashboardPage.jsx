import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Users, UserCheck, CalendarOff, FileText } from 'lucide-react';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#22c55e', '#ef4444', '#f59e0b'];
const RADIAN = Math.PI / 180;

const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name, value }) => {
  const radius = outerRadius + 30;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  if (percent < 0.05) return null;
  return (
    <text x={x} y={y} fill="#374151" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="text-xs dark:fill-gray-300">
      {`${name} (${value})`}
    </text>
  );
};

export default function DashboardPage() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/dashboard/stats').then(r => setStats(r.data)).catch(() => {});
  }, []);

  if (!stats) return <div className="flex items-center justify-center h-64 text-gray-400 dark:text-dark-400">Chargement...</div>;

  const kpis = [
    { label: 'Employes', value: stats.totalEmployes, icon: Users, color: 'bg-blue-500' },
    { label: 'Presents', value: stats.presentsAujourdhui, icon: UserCheck, color: 'bg-green-500' },
    { label: 'En conge', value: stats.enConge, icon: CalendarOff, color: 'bg-amber-500' },
    { label: 'Pointages', value: stats.totalPointages, icon: FileText, color: 'bg-blue-500' },
  ];

  const pieData = [
    { name: 'Presents', value: stats.presentsAujourdhui },
    { name: 'Absents', value: Math.max(0, stats.totalEmployes - stats.presentsAujourdhui - stats.enConge) },
    { name: 'En conge', value: stats.enConge },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tableau de bord</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="bg-white dark:bg-dark-900 rounded-xl p-5 border border-gray-200 dark:border-dark-800 shadow-sm">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg ${kpi.color} flex items-center justify-center text-white`}>
                <kpi.icon size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{kpi.value}</p>
                <p className="text-sm text-gray-500 dark:text-dark-400">{kpi.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-dark-900 rounded-xl p-6 border border-gray-200 dark:border-dark-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Presence</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={2} dataKey="value" label={renderLabel} labelLine={{ stroke: '#9ca3af', strokeWidth: 1 }}>
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-dark-900 rounded-xl p-6 border border-gray-200 dark:border-dark-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Presence hebdomadaire</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.presenceSemaine || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="jour" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip />
              <Line type="monotone" dataKey="nombre" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-dark-900 rounded-xl p-6 border border-gray-200 dark:border-dark-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Pointages recents</h3>
          <div className="space-y-2">
            {(stats.pointagesRecents || []).map((p, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-dark-800 last:border-0">
                <span className="text-sm text-gray-700 dark:text-dark-300">{p.employe}</span>
                <span className="text-xs text-gray-400 dark:text-dark-400">{p.date}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.statut === 'Present' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                  {p.statut}
                </span>
              </div>
            ))}
            {(stats.pointagesRecents || []).length === 0 && <p className="text-sm text-gray-400 dark:text-dark-400">Aucun pointage</p>}
          </div>
        </div>

        <div className="bg-white dark:bg-dark-900 rounded-xl p-6 border border-gray-200 dark:border-dark-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Demandes de conge recentes</h3>
          <div className="space-y-2">
            {(stats.congesRecents || []).map((c, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-dark-800 last:border-0">
                <div>
                  <p className="text-sm text-gray-700 dark:text-dark-300">{c.employe}</p>
                  <p className="text-xs text-gray-400 dark:text-dark-400">{c.motif} - {c.nbrJours}j</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  c.statut === 'Termine' ? 'bg-gray-100 text-gray-600 dark:bg-dark-700 dark:text-dark-400' :
                  c.statut === 'En cours' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                  'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                }`}>{c.statut}</span>
              </div>
            ))}
            {(stats.congesRecents || []).length === 0 && <p className="text-sm text-gray-400 dark:text-dark-400">Aucune demande</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
