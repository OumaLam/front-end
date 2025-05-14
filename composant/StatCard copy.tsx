import { useEffect, useState } from 'react';
import axios from 'axios';

export default function StatCard({ title, endpoint }: { title: string, endpoint: string }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    axios.get(`http://localhost:8080/api${endpoint}`)
      .then(res => setValue(res.data))
      .catch(err => console.error(err));
  }, [endpoint]);

  return (
    <div className="bg-white p-6 rounded-xl shadow text-center">
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="text-3xl font-bold text-blue-600">{value}</p>
    </div>
  );
}
