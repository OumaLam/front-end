'use client';
import React, { useEffect, useState } from 'react';
import { GiCow } from 'react-icons/gi';
import { ShoppingCart, Users } from 'lucide-react';
import GrapheStatut from './GrapheStatut';
import StatutBarChart from './BarChart';
import dynamic from 'next/dynamic';
import axios from 'axios';
import StatCard from './StatCard';
import LastAnimals from './LastAnimals';
import TopBar from './TopBare';
// import LastAnimals from './LastAnimals'; // Décommenter si utilisé
// import axios from 'axios';

const GrapheSexe = dynamic(() => import('./GrapheSexe'), { ssr: false });

const statuts = ['vendu', 'mort', 'appatu', 'achete', 'nee'];

export default function AdminDashboardPage() {
    const [value, setValue] = useState(0);
    useEffect(() => {
    axios.get(`http://localhost:8080/api/dashboard/stats/totalAnimaux`)
      .then(res => setValue(res.data))
      .catch(err => console.error(err));
  }, []);

  const [totalEmployer, setTotalEmployer] = useState(0);
    useEffect(() => {
    axios.get(`http://localhost:8080/api/dashboard/stats/totalEmployer`)
      .then(res => setTotalEmployer(res.data))
      .catch(err => console.error(err));
  }, []);

  const [statutValue, setStatutValue] = useState(0);
    useEffect(() => {
    axios.get(`http://localhost:8080/api/dashboard/statut-distribution`)
      .then(res => setStatutValue(res.data))
      .catch(err => console.error(err));
  }, []);
   console.log(statutValue);
  // Décommenter si les statistiques API sont actives
  // useEffect(() => {
  //   axios.get("http://localhost:8080/api/dashboard/stats")
  //     .then((res) => setStats(res.data))
  //     .catch((err) => console.error(err));
  // }, []);

  return (
    <main className="min-h-screen   space-y-8">
      <TopBar/>
      <h1 className="text-3xl font-bold text-gray-800"> Tableau de bord </h1>
            {/* SECTION 1 - Top cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <CardStat title="Total Animaux" value={value} icon={<GiCow size={24} />} />
        <CardStat title="Total Employés" value={totalEmployer} icon={<Users size={24} />} />
        <CardStat
          title="Naissances"
          value={
    Array.isArray(statutValue)
      ? statutValue.find(s => s.statutTitre === "nee")?.count || 0
      : 0
  }
          icon="🐄"
        />

        <CardStat
  title="Acheté"
  value={
    Array.isArray(statutValue)
      ? statutValue.find(s => s.statutTitre === "achete")?.count || 0
      : 0
  }
  icon={<ShoppingCart size={24} />}
  bg="bg-yellow-50"
/>

      </div>
      {/* Section Statistiques 
      {stats && (
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {stats.totalAnimaux && (
            <StatCard
              title="Nombre total d'animaux"
              value={value}
              icon={GiCow}
            />
          )}
          {stats.totalEmployes && (
            <StatCard
              title="Nombre d'employés"
              value={value}
              icon={Users}
            />
          )}
           Ajoute d'autres stats ici si nécessaire 
        </section>
      )}*/}

      {/* Section Graphiques globaux */}
      {/* <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GrapheSexe />
        <GrapheStatut />
      </section> */}
      {/* <LastAnimals/> */}

      {/* Section BarCharts mensuels par statut */}
      <section>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">📅 Répartition mensuelle par statut</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {statuts.map((statut) => (
            <StatutBarChart key={statut} statut={statut} />
          ))}
        </div>
      </section>

      {/* Section derniers ajouts */}
      {/* <section>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">🆕 Derniers animaux ajoutés</h2>
        <LastAnimals />
      </section> */}
    </main>

    
  );

  function CardStat({ title, value, icon, bg = "bg-white" }: { title: string; value: string; icon: any; bg?: string }) {
  return (
    <div className={`${bg} p-4 rounded-xl shadow flex items-center space-x-4 hover:shadow-md transition`}>
      <div className="text-blue-600 text-2xl">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-xl font-semibold text-gray-700">{value}</p>
      </div>
    </div>
  );
}
}
