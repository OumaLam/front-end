'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { PlusCircle } from 'lucide-react';
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import LoadingPage from './LoadingPage';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const AnimalDetails = () => {
  const { idAnimal } = useParams();
  const [animal, setAnimal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('poids');
  const [filterDate, setFilterDate] = useState('');
  const [vaccinationList, setVaccinationList] = useState([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Poids
  const [newPoids, setNewPoids] = useState('');
  const [newDate, setNewDate] = useState('');
  const [openPoidsDialog, setOpenPoidsDialog] = useState(false);

  // Vaccination
  const [idVaccin, setIdVaccin] = useState('');
  const [vaccinDate, setVaccinDate] = useState('');
  const [openVaccinDialog, setOpenVaccinDialog] = useState(false);

  // Contrôle Médical
  const [controleDate, setControleDate] = useState('');
  const [maladie, setMaladie] = useState('');
  const [traitement, setTraitement] = useState('');
  const [openControlDialog, setOpenControlDialog] = useState(false);

  useEffect(() => {
    const fetchVaccination = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/vaccinations/nonInjecter/${idAnimal}`);
        setVaccinationList(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des vaccinations", error);
      }
    };
    fetchVaccination();
  }, []);


  const exportAnimalDetailsToExcel = () => {
  if (!animal) return;

  const poidsSheet = animal.poids?.map((p) => ({
    Date: formatDate(p.dateMesure),
    Poids: p.poids
  }));

  const vaccinationSheet = animal.vaccinations?.map((v) => ({
    Date: formatDate(v.dateVaccination),
    Vaccin: v.vaccinNom
  }));

  const controlSheet = animal.controles?.map((c) => ({
    Date: formatDate(c.dateControl),
    Maladie: c.maladie,
    Traitement: c.traitement
  }));

  const workbook = XLSX.utils.book_new();

  const sheetPoids = XLSX.utils.json_to_sheet(poidsSheet);
  XLSX.utils.book_append_sheet(workbook, sheetPoids, "Poids");

  const sheetVaccins = XLSX.utils.json_to_sheet(vaccinationSheet);
  XLSX.utils.book_append_sheet(workbook, sheetVaccins, "Vaccinations");

  const sheetControls = XLSX.utils.json_to_sheet(controlSheet);
  XLSX.utils.book_append_sheet(workbook, sheetControls, "Contrôles Médicaux");

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
  saveAs(data, `animal_${animal.animal?.idAnimal}_details.xlsx`);
};

  const fetchAnimalDetails = () => {
    axios.get(`http://localhost:8080/api/animal/${idAnimal}/details`)
      .then(res => {
        setAnimal(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (idAnimal) fetchAnimalDetails();
  }, [idAnimal]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterType, filterDate]);

  const isAfterDate = (dateStr) => {
    if (!filterDate) return true;
    return new Date(dateStr) >= new Date(filterDate);
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('fr-FR');

  const filteredPoids = animal?.poids?.filter(p => isAfterDate(p.dateMesure));
  const filteredVaccinations = animal?.vaccinations?.filter(v => isAfterDate(v.dateVaccination));
  const filteredControls = animal?.controles?.filter(c => isAfterDate(c.dateControl));

  const paginate = (data) => {
    const start = (currentPage - 1) * itemsPerPage;
    return data?.slice(start, start + itemsPerPage);
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1) return;
    setCurrentPage(newPage);
  };

  const handleAddPoids = () => {
    if (!newPoids || !newDate || isNaN(newPoids) || Number(newPoids) <= 0) {
      return alert("Veuillez entrer un poids valide et une date.");
    }
    axios.post(`http://localhost:8080/api/animal/${idAnimal}/poids`, {
      poids: newPoids,
      dateMesure: newDate
    })
      .then(() => {
        alert("Poids ajouté !");
        setNewPoids('');
        setNewDate('');
        fetchAnimalDetails();
        setOpenPoidsDialog(false);
      })
      .catch(err => {
        console.error(err);
        alert("Erreur lors de l'ajout du poids.");
      });
  };

  const handleAddVaccination = () => {
    if (!idVaccin || !vaccinDate) return alert("Veuillez remplir tous les champs.");
    axios.post(`http://localhost:8080/api/animal/${idAnimal}/vaccination`, {
      idVaccin,
      dateVaccination: vaccinDate
    })
      .then(() => {
        alert("Vaccination ajoutée !");
        setIdVaccin('');
        setVaccinDate('');
        fetchAnimalDetails();
        setOpenVaccinDialog(false);
      })
      .catch(err => {
        console.error(err);
        alert("Erreur lors de l'ajout de la vaccination.");
      });
  };

  const handleAddControl = () => {
    if (!controleDate || !maladie || !traitement) {
      return alert("Veuillez remplir tous les champs.");
    }
    axios.post(`http://localhost:8080/api/animal/${idAnimal}/control`, {
      dateControl: controleDate,
      maladie,
      traitement
    })
      .then(() => {
        alert("Contrôle médical ajouté !");
        setControleDate('');
        setMaladie('');
        setTraitement('');
        fetchAnimalDetails();
        setOpenControlDialog(false);
      })
      .catch(err => {
        console.error(err);
        alert("Erreur lors de l'ajout du contrôle.");
      });
  };

  if (loading) return <LoadingPage />;
  if (!animal) return <div className="text-center p-10 text-red-500">Animal introuvable.</div>;

  const renderPagination = (data) => (
    <div className="flex justify-end mt-4 space-x-2">
      <Button variant="outline" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
        Précédent
      </Button>
      <Button
        variant="outline"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage >= Math.ceil(data?.length / itemsPerPage)}
      >
        Suivant
      </Button>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-8 bg-white rounded-3xl shadow-lg mt-12 mb-12">
      <h2 className="text-4xl font-extrabold mb-8 text-center text-green-700 underline decoration-2">
        {animal.animal?.idAnimal}
      </h2>

      {/* Filtres */}
      <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
        <div className="space-x-3">
          {['poids', 'vaccination', 'controle'].map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 rounded-full ${filterType === type ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'} transition`}
            >
              {type === 'poids' ? 'Poids' : type === 'vaccination' ? 'Vaccination' : 'Contrôle Médical'}
            </button>
          ))}
        </div>
        <div>
          <label className="text-sm text-gray-700 mr-2">Filtrer à partir de :</label>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="border rounded px-3 py-1"
          />
        </div>
      </div>

      {/* Tableaux */}
      <div className="mt-8">
        {filterType === 'poids' && (
          <section>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-green-800">Historique des Poids</h3>
              <Dialog open={openPoidsDialog} onOpenChange={setOpenPoidsDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="text-green-700 border-green-500 hover:bg-green-100">
                    <PlusCircle className="w-5 h-5 mr-1" />
                    Ajouter
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Ajouter un poids</DialogTitle></DialogHeader>
                  <div className="space-y-4">
                    <Input type="number" placeholder="Poids (kg)" value={newPoids} onChange={(e) => setNewPoids(e.target.value)} />
                    <Input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} />
                    <Button onClick={handleAddPoids} className="w-full bg-green-600 text-white">Enregistrer</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <table className="w-full border-collapse text-left">
              <thead className="bg-green-100">
                <tr><th className="p-3">Date</th><th className="p-3">Poids (kg)</th></tr>
              </thead>
              <tbody>
                {paginate(filteredPoids)?.map((p, i) => (
                  <tr key={i} className="border-b hover:bg-green-50">
                    <td className="p-3">{formatDate(p.dateMesure)}</td>
                    <td className="p-3">{p.poids}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {renderPagination(filteredPoids)}
          </section>
        )}

        {filterType === 'vaccination' && (
          <section>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-green-800">Vaccinations</h3>
              <Dialog open={openVaccinDialog} onOpenChange={setOpenVaccinDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="text-green-700 border-green-500 hover:bg-green-100">
                    <PlusCircle className="w-5 h-5 mr-1" />
                    Ajouter
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Ajouter une vaccination</DialogTitle></DialogHeader>
                  <div className="space-y-4">
                    <select
                      className="w-full border p-2 rounded"
                      value={idVaccin}
                      onChange={(e) => setIdVaccin(e.target.value)}
                    >
                      <option value="">Choisir un vaccin</option>
                      {vaccinationList.map((v, i) => (
                        <option key={i} value={v.idVaccin}>{v.vaccinNom}</option>
                      ))}
                    </select>
                    <Input type="date" value={vaccinDate} onChange={(e) => setVaccinDate(e.target.value)} />
                    <Button onClick={handleAddVaccination} className="w-full bg-green-600 text-white">Enregistrer</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <table className="w-full border-collapse text-left">
              <thead className="bg-green-100">
                <tr><th className="p-3">Date</th><th className="p-3">Vaccin</th></tr>
              </thead>
              <tbody>
                {paginate(filteredVaccinations)?.map((v, i) => (
                  <tr key={i} className="border-b hover:bg-green-50">
                    <td className="p-3">{formatDate(v.dateVaccination)}</td>
                    <td className="p-3">{v.vaccinNom}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {renderPagination(filteredVaccinations)}
          </section>
        )}

        {filterType === 'controle' && (
          <section>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-green-800">Contrôles Médicaux</h3>
              <Dialog open={openControlDialog} onOpenChange={setOpenControlDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="text-green-700 border-green-500 hover:bg-green-100">
                    <PlusCircle className="w-5 h-5 mr-1" />
                    Ajouter
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Ajouter un contrôle médical</DialogTitle></DialogHeader>
                  <div className="space-y-4">
                    <Input type="date" value={controleDate} onChange={(e) => setControleDate(e.target.value)} />
                    <Input placeholder="Maladie" value={maladie} onChange={(e) => setMaladie(e.target.value)} />
                    <textarea
                      placeholder="Traitement"
                      value={traitement}
                      rows={4}
                      cols={62}
                      onChange={(e) => setTraitement(e.target.value)}
                      className='border-2 gray'>
                    </textarea>
                    <Button onClick={handleAddControl} className="w-full bg-green-600 text-white">Enregistrer</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            
            <table className="w-full border-collapse text-left">
              <thead className="bg-green-100">
                <tr><th className="p-3">Date</th><th className="p-3">Maladie</th><th className="p-3">Traitement</th></tr>
              </thead>
              <tbody>
                {paginate(filteredControls)?.map((c, i) => (
                  <tr key={i} className="border-b hover:bg-green-50">
                    <td className="p-3">{formatDate(c.dateControl)}</td>
                    <td className="p-3">{c.maladie}</td>
                    <td className="p-3">{c.traitement}</td>
                  </tr>
                ))}
              </tbody>
            </table>
             
            {renderPagination(filteredControls)}
            
          </section>
          
        )}
<button
  onClick={exportAnimalDetailsToExcel}
  className="flex items-center gap-2 text-green-700 font-medium hover:underline hover:text-green-900 transition duration-200"
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
  </svg>
  <span>Exporter Excel</span>
</button>


      </div>
      
    </div>
  );
};

export default AnimalDetails;
