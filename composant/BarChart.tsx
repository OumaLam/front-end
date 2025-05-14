'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface MonthlyData {
  mois: string;
  count: number;
}

const MONTHS = ['Jan', 'Fév', 'Mars', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'];
const COLORS = [
  '#60a5fa', '#f472b6', '#34d399', '#c084fc',
  '#fbbf24', '#f87171', '#a3e635', '#38bdf8',
  '#fb923c', '#cbd5e1', '#d946ef', '#22c55e',
];

const StatutBarChart = ({ statut }: { statut: string }) => {
  const [data, setData] = useState<MonthlyData[]>([]);

  useEffect(() => {
    axios.get(`http://localhost:8080/api/dashboard/statut-monthly/${statut}`)
      .then(res => {
        const formatted = res.data.map((item: any) => ({
          mois: MONTHS[item.mois - 1],
          count: item.count,
        }));
        setData(formatted);
      })
      .catch(error => console.error("Erreur lors du chargement des données :", error));
  }, [statut]);

  // Si aucune donnée, ne rien afficher
  if (!data.length) return null;

  return (
    <div className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition duration-300 ease-in-out">
      <h2 className="text-md font-semibold text-center text-gray-700 mb-3 uppercase tracking-wide">
        {statut}
      </h2>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: -10, bottom: 10 }}
          barCategoryGap="30%"
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis dataKey="mois" tick={{ fontSize: 11, fill: '#6b7280' }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#6b7280' }} />
          <Tooltip
            contentStyle={{ backgroundColor: '#fff', borderRadius: '6px', border: '1px solid #e5e7eb' }}
            labelStyle={{ color: '#6b7280' }}
            itemStyle={{ color: '#4b5563' }}
          />
          <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={18} animationDuration={800}>
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StatutBarChart;
