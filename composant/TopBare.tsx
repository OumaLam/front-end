'use client';
import { useEffect, useState } from 'react';
import { Bell, UserCircle } from 'lucide-react';
import axios from 'axios';

export default function TopBar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get("/api/user")
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
        console.error("Erreur de récupération de l'utilisateur :", err);
      });
  }, []);

  return (
    <header className="rounded-xl bg-white shadow border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-[#2d775c] text-white rounded-full flex items-center justify-center font-bold text-lg">
          🐄
        </div>
        <h1 className="text-2xl font-semibold text-gray-800">Gestion d'Élevage</h1>
      </div>

      <div className="flex items-center space-x-6">
        <div className="relative cursor-pointer">
          <Bell className="w-6 h-6 text-gray-600 hover:text-blue-500 transition" />
          <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
          <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-500 rounded-full"></span>
        </div>

        <div className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 px-3 py-1 rounded-md">
          <UserCircle className="w-6 h-6 text-blue-500" />
          <span className="text-sm text-gray-700 font-medium">
            {user ? `${user.prenom} ${user.nom}` : ''}
          </span>
        </div>
      </div>
    </header>
  );
}
