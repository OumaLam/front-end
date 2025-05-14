import Sidebar from "@/composant/Sidebar";
import AddVaccinationForm from "@/composant/AddVaccinationForm";

export default function NewVaccination() {
  
  return (
    <div className="flex min-h-screen bg-green-50">
      <Sidebar />
      <main className="flex-1 p-6 space-y-8 ">
      <AddVaccinationForm/>     
      </main>
    </div>
  
  );
}