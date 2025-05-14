"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaSyringe,
  FaVenusMars,
  FaEdit,
  FaTrash,
  FaEye,
  FaPlug,
} from "react-icons/fa";
import { MdChildCare } from "react-icons/md";
import { useRouter } from "next/navigation";
import { PlusCircle } from "lucide-react";

const VaccinationList = () => {
  const [vaccinations, setVaccinations] = useState([]);
  const [isClient, setIsClient] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);

    const fetchVaccinations = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/vaccinations");
        setVaccinations(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des vaccinations", error);
      }
    };

    fetchVaccinations();
  }, []);

  const formatAge = (age) => {
    const [years, months, days] = age.split("_");
    return `${years} an(s), ${months} mois, ${days} jour(s)`;
  };

  const handleDelete = async (idVaccin) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce vaccin ?")) {
      try {
        await axios.delete(`http://localhost:8080/api/vaccinations/${idVaccin}`);
        setVaccinations((prev) => prev.filter((v) => v.idVaccin !== idVaccin));
      } catch (error) {
        console.error("Erreur lors de la suppression", error);
      }
    }
  };

  const totalPages = Math.ceil(vaccinations.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentVaccinations = vaccinations.slice(indexOfFirst, indexOfLast);

  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  if (!isClient) return null;

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow space-y-8 my-10">
      <h3 className="flex justify-center items-center gap-2 text-2xl font-bold text-[#2d775c] mb-6">
        <FaSyringe />
        Liste des Vaccinations
      </h3>

      <button
          onClick={() => router.push('/dashboard-admin/Vaccination/new')}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl shadow transition"
        >
          <PlusCircle size={20} /> Ajouter
        </button>

      {vaccinations.length === 0 ? (
        <p className="text-center text-gray-500">Aucune vaccination trouvée.</p>
      ) : (
        <div className="space-y-6 mt-6">
          {currentVaccinations.map((vaccination) => (
            <div key={vaccination.idVaccin} className="p-6 bg-green-50 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-xl font-semibold text-[#2d775c]">
                  {vaccination.vaccinNom}
                </h4>
                <div className="flex space-x-2">
                <button
                    onClick={() =>
                      router.push(`/dashboard-admin/Vaccination/animaux-non-vaccines/${vaccination.idVaccin}`)
                    }
                    className="text-blue-600 hover:text-blue-800"
                    title="Ajouter animal vaccine"
                  >
                    <FaSyringe />
                  </button>
                  <button
                    onClick={() =>
                      router.push(`/dashboard-admin/Vaccination/edit/${vaccination.idVaccin}`)
                    }
                    className="text-blue-600 hover:text-blue-800"
                    title="Modifier"
                  >
                 <FaEye />
                  </button>
                  <button
                    onClick={() => handleDelete(vaccination.idVaccin)}
                    className="text-red-600 hover:text-red-800"
                    title="Supprimer"
                  >
                    <FaTrash />
                  </button>
                  <button
                    onClick={() =>
                      router.push(`/dashboard-admin/Vaccination/details/${vaccination.idVaccin}`)
                    }
                    className="text-green-600 hover:text-green-800"
                    title="Détails"
                  >
                   
                  </button>
                </div>
              </div>

              <div className="mt-4 flex flex-col md:flex-row gap-4">
                <div className="flex items-center gap-2">
                  <MdChildCare />
                  <span className="font-bold">Âge Cible : </span>
                  <span>{formatAge(vaccination.cibleAge)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaVenusMars />
                  <span className="font-bold">Sexe Cible : </span>
                  <span>{vaccination.cibleSexe}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {vaccinations.length > itemsPerPage && (
        <div className="flex justify-center gap-2 mt-8">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Précédent
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => goToPage(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1 ? "bg-[#2d775c] text-white" : "bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Suivant
          </button>
        </div>
      )}
    </div>
  );
};

export default VaccinationList;
