"use client";
import React, { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

import {
  FaDumbbell,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaSignature,
  FaVenusMars,
  FaListAlt,
  FaEdit
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

export default function AnimalEditDialog({ animal, isOpen, setIsOpen }) {
  const [formData, setFormData] = useState({
    idAnimal: animal?.idAnimal || "",
    sexe: animal?.sexe || "",
    race: animal?.race || "",
    dateNaissance: animal?.dateNaissance || "",
    statutTitre: animal?.statut?.statutTitre || "",
    dateStatut: animal?.statut?.dateStatut || "",
    prix: animal?.statut?.prix || "",
    poids: animal?.poids?.[0]?.poids || "",
    dateMesure: animal?.poids?.[0]?.dateMesure || "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleClose = () => setIsOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dto = {
      idAnimal: formData.idAnimal,
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
await axios.put("http://localhost:8080/api/animal/update", dto);


      toast.success(" Animal modifié avec succès !");
      handleClose();
    } catch (error) {
      toast.error("Erreur lors de la modification !");
      console.error("Erreur :", error);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Toaster />
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-90"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-90"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-8 text-left align-middle shadow-xl transition-all">
                <motion.form
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  <h3 className="flex justify-center items-center gap-2 text-2xl font-bold text-[#2d775c] mb-6">
                    <GiCow />
                    Modifier Animal
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <div>
                      <label htmlFor="idAnimal">N° Animal</label>
                      <InputWrapper icon={<FaSignature />}>
                        <input
                          name="idAnimal"
                          value={formData.idAnimal}
                          onChange={handleChange}
                          className="pl-10 pr-4 py-3 w-full border rounded-lg"
                          required
                          disabled
                        />
                      </InputWrapper>
                    </div>

                    <div>
                      <label htmlFor="sexe">Sexe</label>
                      <InputWrapper icon={<FaVenusMars />}>
                        <select
                          name="sexe"
                          value={formData.sexe}
                          onChange={handleChange}
                          className="pl-10 pr-4 py-3 w-full border rounded-lg"
                          required
                        >
                          <option value="">Sélectionnez</option>
                          <option value="male">Mâle</option>
                          <option value="femelle">Femelle</option>
                        </select>
                      </InputWrapper>
                    </div>

                    <div>
                      <label>Race</label>
                      <InputWrapper icon={<FaListAlt />}>
                        <input
                          name="race"
                          value={formData.race}
                          onChange={handleChange}
                          className="pl-10 pr-4 py-3 w-full border rounded-lg"
                          required
                        />
                      </InputWrapper>
                    </div>

                    <div>
                      <label>Date de naissance</label>
                      <InputWrapper icon={<FaCalendarAlt />}>
                        <input
                          type="date"
                          name="dateNaissance"
                          value={formData.dateNaissance}
                          onChange={handleChange}
                          className="pl-10 pr-4 py-3 w-full border rounded-lg"
                          required
                        />
                      </InputWrapper>
                    </div>

                    <div>
                      <label>Statut</label>
                      <InputWrapper icon={<FaListAlt />}>
                        <select
                          name="statutTitre"
                          value={formData.statutTitre}
                          onChange={handleChange}
                          className="pl-10 pr-4 py-3 w-full border rounded-lg"
                        >
                          <option value="">Sélectionnez</option>
                            <option value="vendu">Vendu</option>
                            <option value="abattu">Abattu</option>
                            <option value="mort">Mort</option>

                        </select>
                      </InputWrapper>
                    </div>

                    {formData.statutTitre !== "nee" && (
                      <div>
                        <label>Date statut</label>
                        <InputWrapper icon={<FaCalendarAlt />}>
                          <input
                            type="date"
                            name="dateStatut"
                            value={formData.dateStatut}
                            onChange={handleChange}
                            className="pl-10 pr-4 py-3 w-full border rounded-lg"
                          />
                        </InputWrapper>
                      </div>
                    )}

                    {["achete", "vendu"].includes(formData.statutTitre) && (
                      <div>
                        <label>Prix</label>
                        <InputWrapper icon={<FaMoneyBillWave />}>
                          <input
                            name="prix"
                            value={formData.prix}
                            onChange={handleChange}
                            className="pl-10 pr-4 py-3 w-full border rounded-lg"
                          />
                        </InputWrapper>
                      </div>
                    )}

                    <div>
                      <label>Poids (kg)</label>
                      <InputWrapper icon={<FaDumbbell />}>
                        <input
                          type="number"
                          name="poids"
                          value={formData.poids}
                          onChange={handleChange}
                          className="pl-10 pr-4 py-3 w-full border rounded-lg"
                          required
                        />
                      </InputWrapper>
                    </div>

                    <div>
                      <label>Date de mesure</label>
                      <InputWrapper icon={<FaCalendarAlt />}>
                        <input
                          type="date"
                          name="dateMesure"
                          value={formData.dateMesure}
                          onChange={handleChange}
                          className="pl-10 pr-4 py-3 w-full border rounded-lg"
                          required
                        />
                      </InputWrapper>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4 pt-4">
                    <button
                      type="button"
                      className="px-6 py-2 rounded border border-gray-300 hover:bg-gray-100"
                      onClick={handleClose}
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="bg-[#2d775c] text-white px-6 py-2 rounded hover:bg-green-700"
                    >
                      <FaEdit className="inline mr-2" />
                      Modifier
                    </button>
                  </div>
                </motion.form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
