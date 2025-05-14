"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { useRouter, useParams } from "next/navigation";
import {
  FaSyringe,
  FaVenusMars,
  FaStickyNote,
  FaSave,
} from "react-icons/fa";
import { MdChildCare } from "react-icons/md";

const InputWrapper = ({ icon, children }) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
      {icon}
    </div>
    {children}
  </div>
);

const EditVaccinationForm = () => {
  const router = useRouter();
  const { id } = useParams(); // ID de vaccination depuis l'URL

  const [formData, setFormData] = useState({
    vaccinNom: "",
    cibleAgeJour: "",
    cibleAgeMois: "",
    cibleAgeAnnee: "",
    cibleSexe: "Tous",
    remarqueVaccination: "",
  });

  useEffect(() => {
    const fetchVaccination = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/vaccinations/${id}`);
        const data = res.data;

        const [annee, mois, jour] = data.cibleAge.split("_");
        setFormData({
          vaccinNom: data.vaccinNom,
          cibleAgeJour: jour || "",
          cibleAgeMois: mois || "",
          cibleAgeAnnee: annee || "",
          cibleSexe: data.cibleSexe,
          remarqueVaccination: data.remarqueVaccination || "",
        });
      } catch (error) {
        toast.error("❌ Erreur lors du chargement !");
        console.error("Erreur de chargement :", error);
      }
    };

    if (id) fetchVaccination();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cibleAge = `${formData.cibleAgeAnnee}_${formData.cibleAgeMois}_${formData.cibleAgeJour}`;

    const updatedData = {
      vaccinNom: formData.vaccinNom,
      cibleAge,
      cibleSexe: formData.cibleSexe,
      remarqueVaccination: formData.remarqueVaccination,
    };

    try {
      await axios.put(`http://localhost:8080/api/vaccinations/${id}`, updatedData);
      toast.success("✅ Vaccination modifiée !");
      router.push("/dashboard-admin/Vaccination");
    } catch (error) {
      toast.error("❌ Erreur lors de la modification !");
      console.error("Erreur :", error);
    }
  };

  return (
    <>
      <Toaster />
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl mx-auto p-8 bg-white rounded-xl shadow space-y-8 my-10"
      >
        <h3 className="flex justify-center items-center gap-2 text-2xl font-bold text-[#2d775c] mb-6">
          <FaSyringe />
          Modifier une Vaccination
        </h3>

        {/* Nom du vaccin & Sexe cible */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="vaccinNom" className="block text-sm font-medium mb-1">
              Nom du vaccin
            </label>
            <InputWrapper icon={<FaSyringe />}>
              <input
                id="vaccinNom"
                name="vaccinNom"
                type="text"
                value={formData.vaccinNom}
                onChange={handleChange}
                required
                className="pl-10 pr-4 py-3 w-full border rounded-lg"
              />
            </InputWrapper>
          </div>

          <div>
            <label htmlFor="cibleSexe" className="block text-sm font-medium mb-1">
              Sexe cible
            </label>
            <InputWrapper icon={<FaVenusMars />}>
              <select
                id="cibleSexe"
                name="cibleSexe"
                value={formData.cibleSexe}
                onChange={handleChange}
                required
                className="pl-10 pr-4 py-3 w-full border rounded-lg"
              >
                <option value="Tous">Tous</option>
                <option value="Mâle">Mâle</option>
                <option value="Femelle">Femelle</option>
              </select>
            </InputWrapper>
          </div>
        </div>

        {/* Âge cible */}
        <div>
          <label className="block text-sm font-medium mb-1">Âge cible</label>
          <div className="flex gap-2">
            {["Annee", "Mois", "Jour"].map((unit, index) => (
              <InputWrapper key={unit} icon={<MdChildCare />}>
                <input
                  type="number"
                  name={`cibleAge${unit}`}
                  value={formData[`cibleAge${unit}`]}
                  onChange={handleChange}
                  required
                  placeholder={unit.toLowerCase()}
                  className="pl-10 pr-4 py-3 w-full border rounded-lg"
                />
              </InputWrapper>
            ))}
          </div>
        </div>

        {/* Remarques */}
        <div>
          <label htmlFor="remarqueVaccination" className="block text-sm font-medium mb-1">
            Remarques
          </label>
          <InputWrapper icon={<FaStickyNote />}>
            <textarea
              id="remarqueVaccination"
              name="remarqueVaccination"
              value={formData.remarqueVaccination}
              onChange={handleChange}
              rows={3}
              className="pl-10 pr-4 py-3 w-full border rounded-lg"
            />
          </InputWrapper>
        </div>

        {/* Bouton */}
        <button
          type="submit"
          className="w-1/2 mx-auto bg-[#2d775c] text-white py-3 rounded-lg font-semibold border-2 border-green-700 hover:bg-green-700 hover:border-green-800 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 cursor-pointer"
        >
          <FaSave />
          <span>Enregistrer</span>
        </button>
      </motion.form>
    </>
  );
};

export default EditVaccinationForm;
