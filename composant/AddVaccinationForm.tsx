"use client";
import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import {
  FaSyringe,
  FaVenusMars,
  FaStickyNote,
  FaPlus,
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

const VaccinationForm = () => {
  const [formData, setFormData] = useState({
    vaccinNom: "",
    cibleAgeJour: "",
    cibleAgeMois: "",
    cibleAgeAnnee: "",
    cibleSexe: "Tous",
    remarqueVaccination: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Combinaison des valeurs d'âge dans un seul champ
    const cibleAge = `${formData.cibleAgeAnnee}_${formData.cibleAgeMois}_${formData.cibleAgeJour}`;

    const dto = {
      vaccinNom: formData.vaccinNom,
      cibleAge: cibleAge, // Envoi de l'âge sous la forme "année_mois_jour"
      cibleSexe: formData.cibleSexe,
      remarqueVaccination: formData.remarqueVaccination,
    };

    try {
      await axios.post("http://localhost:8080/api/vaccinations/new", dto);
      toast.success("✅ Vaccination ajoutée avec succès !");
      setFormData({
        vaccinNom: "",
        cibleAgeJour: "",
        cibleAgeMois: "",
        cibleAgeAnnee: "",
        cibleSexe: "Tous",
        remarqueVaccination: "",
      });
    } catch (error) {
      toast.error("❌ Une erreur est survenue !");
      console.error("Erreur:", error);
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
        className="max-w-2xl mx-auto p-8 bg-white rounded-xl shadow space-y-8 my-10 ml-80"
      >
        <h3 className="flex justify-center items-center gap-2 text-2xl font-bold text-[#2d775c] mb-6">
          <FaSyringe />
          Ajouter une Vaccination
        </h3>

        {/* Ligne 1 : Nom du vaccin & Sexe cible */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nom du vaccin */}
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

          {/* Sexe cible */}
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

        {/* Ligne 2 : Âge cible valeur + unité */}
        <div>
          <label className="block text-sm font-medium mb-1">Âge cible</label>
          <div className="flex gap-2">
            <InputWrapper icon={<MdChildCare />}>
              <input
                type="number"
                name="cibleAgeAnnee"
                value={formData.cibleAgeAnnee}
                onChange={handleChange}
                required
                placeholder="année"
                className="pl-10 pr-4 py-3 w-full border rounded-lg"
              />
            </InputWrapper>
            <InputWrapper icon={<MdChildCare />}>
              <input
                type="number"
                name="cibleAgeMois"
                value={formData.cibleAgeMois}
                onChange={handleChange}
                required
                placeholder="mois"
                className="pl-10 pr-4 py-3 w-full border rounded-lg"
              />
            </InputWrapper>
            <InputWrapper icon={<MdChildCare />}>
              <input
                type="number"
                name="cibleAgeJour"
                value={formData.cibleAgeJour}
                onChange={handleChange}
                required
                placeholder="jour"
                className="pl-10 pr-4 py-3 w-full border rounded-lg"
              />
            </InputWrapper>
          </div>
        </div>

        {/* Ligne 3 : Remarques */}
        <div>
          <label htmlFor="remarqueVaccination" className="block text-sm font-medium mb-1">
            Remarques
          </label>
          <InputWrapper icon={<FaStickyNote />}>
            <textarea required
              id="remarqueVaccination"
              name="remarqueVaccination"
              value={formData.remarqueVaccination}
              onChange={handleChange}
              rows={3}
              className="pl-10 pr-4 py-3 w-full border rounded-lg"
            />
          </InputWrapper>
        </div>

        {/* Bouton d’envoi */}
        <button
          type="submit"
          className="w-1/2 mx-auto bg-[#2d775c] text-white py-3 rounded-lg font-semibold border-2 border-green-700 hover:bg-green-700 hover:border-green-800 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 cursor-pointer"
        >
          <FaPlus />
          <span>Ajouter</span>
        </button>
      </motion.form>
    </>
  );
};

export default VaccinationForm;
