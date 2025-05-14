"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useParams } from "next/navigation";
import * as XLSX from "xlsx";

// Modal de confirmation
const ConfirmationModal = ({ show, onClose, onConfirm, count, date }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full text-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Confirmation</h2>
        <p className="text-gray-600 mb-6">
          Confirmer la vaccination de <span className="font-bold">{count}</span> animal(s) le{" "}
          <span className="font-bold">{new Date(date).toLocaleDateString()}</span> ?
        </p>
        <div className="flex justify-center gap-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg">
            Annuler
          </button>
          <button onClick={onConfirm} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg">
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
};

// Composant principal
const VaccinationConfirmation = () => {
  const { vaccinId } = useParams();

  const [vaccin, setVaccin] = useState(null);
  const [animals, setAnimals] = useState([]);
  const [filteredAnimals, setFilteredAnimals] = useState([]);
  const [selectedAnimalIds, setSelectedAnimalIds] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [vaccinationDate, setVaccinationDate] = useState("");
  const [showModal, setShowModal] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAnimals.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredAnimals.length / itemsPerPage);

  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/animaux/non-vaccines?vaccinId=${vaccinId}`);
        setAnimals(res.data);
        setFilteredAnimals(res.data);
      } catch (error) {
        toast.error("Erreur lors du chargement des animaux");
      }
    };

    const fetchVaccin = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/vaccins/${vaccinId}`);
        setVaccin(res.data);
      } catch (error) {
        toast.error("Erreur lors du chargement du vaccin.");
      }
    };

    fetchAnimals();
    fetchVaccin();
  }, [vaccinId]);

  const handleCheck = (idAnimal) => {
    setSelectedAnimalIds((prev) =>
      prev.includes(idAnimal) ? prev.filter((id) => id !== idAnimal) : [...prev, idAnimal]
    );
  };

 const handleSearch = (e) => {
  const value = e.target.value.trim().toLowerCase();  // Nettoyer et convertir en minuscule
  setSearchId(value);

  const filtered = animals.filter((a) => {
    // Vérifier si idAnimal existe et convertir en string
    const id = a.idAnimal ? a.idAnimal.toString().toLowerCase() : "";

    return id.includes(value); // Chercher la valeur dans l'ID de l'animal
  });

  setFilteredAnimals(filtered);
  setCurrentPage(1); // Reset pagination sur la recherche
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!vaccinationDate) {
      toast.error("Veuillez sélectionner une date de vaccination.");
      return;
    }

    if (selectedAnimalIds.length === 0) {
      toast.error("Veuillez sélectionner au moins un animal.");
      return;
    }

    setShowModal(true);
  };

  const confirmVaccination = async () => {
    setShowModal(false);
    try {
      await axios.post(`http://localhost:8080/api/animal-vaccinations/${vaccinId}`, {
        vaccinationId: vaccinId,
        animalIds: selectedAnimalIds,
        date: vaccinationDate,
      });
      toast.success("Vaccination enregistrée !");
      setSelectedAnimalIds([]);
    } catch (err) {
      toast.error("Erreur lors de la soumission !");
    }
  };

  const downloadAllExcel = () => {
    const data = filteredAnimals.map((animal) => ({
      "ID Animal": animal.idAnimal,
      Sexe: animal.sexe,
      "Date de naissance": new Date(animal.dateNaissance).toLocaleDateString(),
    
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Tous les animaux");
    XLSX.writeFile(wb, "tous_les_animaux.xlsx");
  };

  return (
    <>
      <Toaster />
      <form onSubmit={handleSubmit} className="max-w-5xl mx-auto bg-white shadow-lg rounded-xl p-10 mt-10">
        <h2 className="text-3xl font-bold text-center text-green-700 mb-8">Confirmer la vaccination</h2>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Rechercher par ID animal"
            value={searchId}
            onChange={handleSearch}
            className="flex-1 border border-gray-300 mr-4 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            type="date"
            value={vaccinationDate}
            onChange={(e) => setVaccinationDate(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            onClick={downloadAllExcel}
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

        {filteredAnimals.length === 0 ? (
          <p className="text-center text-gray-500">Aucun animal trouvé.</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border rounded-lg overflow-hidden">
                <thead className="bg-green-100 text-green-800 uppercase">
                  <tr>
                    <th className="px-4 py-3">Sélection</th>
                    <th className="px-4 py-3">ID</th>
                    <th className="px-4 py-3">Sexe</th>
                    <th className="px-4 py-3">Date de naissance</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((animal) => (
                    <tr key={animal.idAnimal} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-2">
                        <input
                          type="checkbox"
                          className="w-5 h-5"
                          checked={selectedAnimalIds.includes(animal.idAnimal)}
                          onChange={() => handleCheck(animal.idAnimal)}
                        />
                      </td>
                      <td className="px-4 py-2">{animal.idAnimal}</td>
                      <td className="px-4 py-2">{animal.sexe}</td>
                      <td className="px-4 py-2">{new Date(animal.dateNaissance).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center mt-6 space-x-2">
              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                disabled={currentPage === 1}
              >
                Précédent
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-4 py-2 rounded ${currentPage === i + 1 ? "bg-green-600 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                disabled={currentPage === totalPages}
              >
                Suivant
              </button>
            </div>
          </>
        )}

        <div className="text-center mt-6">
          <button
            type="submit"
            disabled={selectedAnimalIds.length === 0}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-8 rounded-lg disabled:opacity-0"
          >
            Enregistrer la vaccination
          </button>
          
        </div>
      </form>

      <ConfirmationModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={confirmVaccination}
        count={selectedAnimalIds.length}
        date={vaccinationDate}
      />
    </>
  );
};

export default VaccinationConfirmation;
