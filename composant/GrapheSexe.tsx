'use client';

import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { useEffect, useState } from 'react';
import axios from 'axios';

const COLORS = ['#36A2EB', '#FF6384'];

export default function GrapheSexe() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/api/dashboard/sexe-distribution')
      .then(res => {
        const chartData = [
          { name: 'Mâle', value: res.data.male || 0 },
          { name: 'Femelle', value: res.data.femelle || 0 },
        ];
        setData(chartData);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md w-fit">
      <h2 className="text-lg font-semibold mb-4">Répartition par Sexe</h2>
      <PieChart width={300} height={300}>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          outerRadius={100}
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
