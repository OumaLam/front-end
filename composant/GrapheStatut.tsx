'use client';

import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { useEffect, useState } from 'react';
import axios from 'axios';

const COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];

interface StatutData {
  statut: string;
  count: number;
}

export default function GrapheStatut() {
  const [data, setData] = useState<StatutData[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    axios.get('http://localhost:8080/api/dashboard/statut-distribution')
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  }, []);

  if (!mounted) return null;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md w-fit">
      <h2 className="text-lg font-semibold mb-4">Répartition par Statut</h2>
      <PieChart width={320} height={320}>
        <Pie
          data={data}
          dataKey="count"
          nameKey="statut"
          outerRadius={110}
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
}
