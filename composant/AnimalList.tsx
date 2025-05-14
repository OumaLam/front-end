'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Eye, Pencil, PlusCircle } from 'lucide-react';
import { format } from 'date-fns';
import AnimalEditDialog from '@/composant/AnimalEditDialog';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';


export default function AnimalList() {

  const exportToExcel = () => {
  const data = filteredAnimals.map(animal => ({
    ID: animal.idAnimal,
    Race: animal.race,
    Sexe: animal.sexe,
    "Date de Naissance": format(new Date(animal.dateNaissance), 'dd/MM/yyyy'),
    Statut: animal.statutTitre,
    ...(statutFilter === 'vendu' || statutFilter === 'achete' ? { Prix: animal.prix } : {})
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Animaux");

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(blob, "animaux.xlsx");
};

  const [animals, setAnimals] = useState([]);
  const [sexeFilter, setSexeFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [statutFilter, setStatutFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const router = useRouter();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8080/api/animal')
      .then(res => setAnimals(res.data))
      .catch(err => console.error(err));
  }, []);

  // 🎯 Appliquer les filtres
  const filteredAnimals = animals.filter(a =>
    (!sexeFilter || a.sexe?.toLowerCase() === sexeFilter.toLowerCase()) &&
    (!dateFilter || new Date(a.dateNaissance) >= new Date(dateFilter)) &&
    (!statutFilter || a?.statutTitre?.toLowerCase() === statutFilter.toLowerCase())
  );

  const totalPages = Math.ceil(filteredAnimals.length / itemsPerPage);
  const currentData = filteredAnimals.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="min-h-screen p-8 bg-gradient-to-b from-green-50 to-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">🐮 Liste des Animaux</h1>
        <button
          onClick={() => router.push('/dashboard-admin/animal/new')}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl shadow transition"
        >
          <PlusCircle size={20} /> Ajouter
        </button>
      </div>

      {/* 🧪 Filtres */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select value={sexeFilter} onChange={e => setSexeFilter(e.target.value)} className="p-2 border rounded-xl shadow-sm">
          <option value="">Tous les sexes</option>
          <option value="male">Mâle</option>
          <option value="femelle">Femelle</option>
        </select>

        <select value={statutFilter} onChange={e => setStatutFilter(e.target.value)} className="p-2 border rounded-xl shadow-sm">
          <option value="">Tous les statuts</option>
          <option value="nee">Née</option>
          <option value="vendu">Vendu</option>
          <option value="achete">Acheté</option>
          <option value="abbatu">Abattu</option>
          <option value="mort">Mort</option>
        </select>

        <input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)} className="p-2 border rounded-xl shadow-sm" />

        <button
            onClick={exportToExcel}
  className="flex items-center gap-2 text-green-700 font-medium hover:underline hover:text-green-900 transition duration-200 pl-87"
          >
            <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-5 h-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v16h16V4H4zm8 12v-8m0 8l-3-3m3 3l3-3" />
  </svg> Exporter Excel
          </button>

      </div>

      {/* 🐮 Table */}
      <div className="overflow-x-auto bg-white rounded-2xl shadow-md p-4">
        <table className="min-w-full text-sm">
          <thead className="text-gray-600 uppercase tracking-wider border-b">
            <tr>
              <th className="py-3 text-left">ID</th>
              <th className="py-3 text-left">Race</th>
              <th className="py-3 text-left">Sexe</th>
              <th className="py-3 text-left">Date de Naissance</th>
              {(statutFilter === 'vendu' || statutFilter === 'achete') && (
                <th className="py-3 text-left">Prix</th>
              )}
              <th className="py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((animal: any) => (
              <tr key={animal.idAnimal} className="border-b hover:bg-gray-50 transition">
                <td className="py-2">{animal.idAnimal}</td>
                <td className="py-2">{animal.race}</td>
                <td className="py-2">{animal.sexe}</td>
                <td className="py-2">{format(new Date(animal.dateNaissance), 'dd/MM/yyyy')}</td>
                 {(statutFilter === 'vendu' || statutFilter === 'achete') && (
                <td className="py-3 text-left">{animal.prix}</td>
              )}                <td className="py-2 text-right space-x-2">
                  <button onClick={() => router.push(`animal/${animal.idAnimal}`)} className="text-blue-600 hover:text-blue-800">
                    <Eye size={18} />
                  </button>
                <button
        onClick={() => {
                      setOpenDialog(true);
                      setSelectedAnimal(animal); 
                 
        }}
        className="text-green-600 hover:text-green-800"
      >
        <Pencil size={18} />
      </button>

      {/* Affiche la modale seulement si openDialog est true */}
      {openDialog && selectedAnimal && (
  <AnimalEditDialog
    animal={selectedAnimal}
    isOpen={openDialog}
    setIsOpen={setOpenDialog}
  />
)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* 📄 Pagination */}
                    <div className="flex justify-between items-center mt-6">
              <button
                className="px-4 py-1 rounded-full bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:opacity-50"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                 Précédent
              </button>

              <div className="flex gap-1">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    className={`px-3 py-1 rounded-full transition text-sm ${
                      i + 1 === currentPage
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    }`}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                className="px-4 py-1 rounded-full bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:opacity-50"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Suivant              </button>
            </div>

      </div>
    </div>
  );
}
