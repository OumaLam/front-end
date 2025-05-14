import axios from 'axios';
import { Key } from 'react';
import useSWR from 'swr';

const fetcher = (url: string) => axios.get(url).then(res => res.data);

export default function LastAnimals() {
  const { data: animals, error } = useSWR('http://localhost:8080/api/animal/last', fetcher);

  if (error) return <p>Erreur de chargement</p>;
  if (!animals) return <p>Chargement...</p>;

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="text-lg font-semibold mb-4">Derniers animaux</h3>
      <ul className="space-y-2">
        {animals.map((animal: { idAnimal: string, dateNaissance: string }, i: Key | null | undefined) => (
          <li key={i} className="flex justify-between border-b py-1">
            <span>{animal.idAnimal}</span>
            <span className="text-sm text-gray-500">{animal.dateNaissance}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
