"use client";
import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import {
  FaDumbbell,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaSignature,
  FaVenusMars,
  FaListAlt,
  FaPlus
} from "react-icons/fa";
import { GiCow } from "react-icons/gi";

const InputWrapper = ({ icon, children }) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
      {icon}
    </div>
    {children}
  </div>
);
const AnimalForm = () => {
  const [formData, setFormData] = useState({
    idAnimal: "",
    sexe: "",
    race: "",
    dateNaissance: "",
    statutTitre: "",
    dateStatut: "",
    prix: "",
    poids: "",
    dateMesure: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dto = {
      idAnimal:formData.idAnimal,
      sexe: formData.sexe,
      race: formData.race,
      dateNaissance: formData.dateNaissance,
      statut:
        formData.statutTitre === "nee"
          ? null
          : {
              statutTitre: formData.statutTitre,
              dateStatut: formData.dateStatut,
              prix: ["vendu", "achete"].includes(formData.statutTitre)
                ? formData.prix
                : null,
              cause: null,
            },
      poids: [
        {
          poids: formData.poids,
          dateMesure: formData.dateMesure,
        },
      ],
    };

    try {
      await axios.post("http://localhost:8080/api/animal/new", dto);
      toast.success("✅ Animal enregistré avec succès !");
      setFormData({
        idAnimal: "",
        sexe: "",
        race: "",
        dateNaissance: "",
        statutTitre: "",
        dateStatut: "",
        prix: "",
        poids: "",
        dateMesure: "",
      });
    } catch (error) {
      toast.error("❌ Une erreur s'est produite !");
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
        className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow space-y-8 my-auto"
      >
        <h3 className="flex justify-center items-center gap-2 text-2xl font-bold text-[#2d775c] mb-6">
          <GiCow   />
          Ajouter un Animal
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        
          {/* ID Animal */}
          <div>
            <label htmlFor="idAnimal" className="block text-sm font-medium mb-1">
              N° Animal
            </label>
            <InputWrapper icon={<FaSignature />}>
              <input
                id="idAnimal"
                name="idAnimal"
                type="text"
                value={formData.idAnimal}
                onChange={handleChange}
                required
                className="pl-10 pr-4 py-3 w-full border rounded-lg"
              />
            </InputWrapper>
          </div>

          {/* Sexe */}
          <div>
            <label htmlFor="sexe" className="block text-sm font-medium mb-1">
              Sexe
            </label>
            <InputWrapper icon={<FaVenusMars />}>
              <select
                id="sexe"
                name="sexe"
                value={formData.sexe}
                onChange={handleChange}
                required
                className="pl-10 pr-4 py-3 w-full border rounded-lg"
              >
                <option value="">Sélectionnez</option>
                <option value="male">Mâle</option>
                <option value="femelle">Femelle</option>
              </select>
            </InputWrapper>
          </div>

          {/* Race */}
          <div>
            <label htmlFor="race" className="block text-sm font-medium mb-1">
              Race
            </label>
            <InputWrapper icon={<FaListAlt />}>
              <input
                id="race"
                name="race"
                type="text"
                value={formData.race}
                onChange={handleChange}
                required
                className="pl-10 pr-4 py-3 w-full border rounded-lg"
              />
            </InputWrapper>
          </div>

          {/* Date de naissance */}
          <div>
            <label htmlFor="dateNaissance" className="block text-sm font-medium mb-1">
              Date de naissance
            </label>
            <InputWrapper icon={<FaCalendarAlt />}>
              <input
                id="dateNaissance"
                name="dateNaissance"
                type="date"
                value={formData.dateNaissance}
                onChange={handleChange}
                required
                className="pl-10 pr-4 py-3 w-full border rounded-lg"
              />
            </InputWrapper>
          </div>

          {/* Statut */}
          <div>
            <label htmlFor="statutTitre" className="block text-sm font-medium mb-1">
              Statut
            </label>
            <InputWrapper icon={<FaListAlt />}>
              <select
                id="statutTitre"
                name="statutTitre"
                value={formData.statutTitre}
                onChange={handleChange}
                required
                className="pl-10 pr-4 py-3 w-full border rounded-lg"
              >
                <option value="">Sélectionnez</option>
                <option value="nee">Née</option>
                <option value="achete">Acheté</option>
              </select>
            </InputWrapper>
          </div>

          {/* Date du statut */}
          {formData.statutTitre !== "nee" && (
            <div>
              <label htmlFor="dateStatut" className="block text-sm font-medium mb-1">
                Date du statut
              </label>
              <InputWrapper icon={<FaCalendarAlt />}>
                <input
                  id="dateStatut"
                  name="dateStatut"
                  type="date"
                  value={formData.dateStatut}
                  onChange={handleChange}
                  required
                  className="pl-10 pr-4 py-3 w-full border rounded-lg"
                />
              </InputWrapper>
            </div>
          )}

          {/* Prix */}
          {[ "achete"].includes(formData.statutTitre) && (
            <div>
              <label htmlFor="prix" className="block text-sm font-medium mb-1">
                Prix
              </label>
              <InputWrapper icon={<FaMoneyBillWave />}>
                <input
                  id="prix"
                  name="prix"
                  type="text"
                  placeholder="Prix"
                  value={formData.prix}
                  onChange={handleChange}
                  required
                  className="pl-10 pr-4 py-3 w-full border rounded-lg"
                />
              </InputWrapper>
            </div>
          )}

          {/* Poids */}
          <div>
            <label htmlFor="poids" className="block text-sm font-medium mb-1">
              Poids initial (kg)
            </label>
            <InputWrapper icon={<FaDumbbell />}>
              <input
                id="poids"
                name="poids"
                type="number"
                value={formData.poids}
                onChange={handleChange}
                required
                className="pl-10 pr-4 py-3 w-full border rounded-lg"
              />
            </InputWrapper>
          </div>

          {/* Date de mesure */}
          <div>
            <label htmlFor="dateMesure" className="block text-sm font-medium mb-1">
              Date de mesure
            </label>
            <InputWrapper icon={<FaCalendarAlt />}>
              <input
                id="dateMesure"
                name="dateMesure"
                type="date"
                value={formData.dateMesure}
                onChange={handleChange}
                required
                className="pl-10 pr-4 py-3 w-full border rounded-lg"
              />
            </InputWrapper>
          </div>
        </div>

        <button
  type="submit"
  className="w-1/2 mx-auto bg-[#2d775c] text-white py-3 rounded-lg font-semibold border-2 border-green-700 hover:bg-green-700 hover:border-green-800 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 curser-pointer"
>
  <FaPlus /> 
  <span>Ajouter</span>
</button>

      </motion.form>
    </>
  );
};

export default AnimalForm;
