'use client';

import AnimalList from "@/composant/AnimalList";
import Sidebar from "@/composant/Sidebar";


export default function AnimalsPage() {
  return (
    <div className="flex min-h-screen bg-green-50">
          <Sidebar />
          <main className="flex-1 p-6 space-y-8 ml-64 p-6">
          <AnimalList/>
          
          </main>
        </div>
  );
}