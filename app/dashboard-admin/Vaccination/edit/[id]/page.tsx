import Sidebar from "@/composant/Sidebar";
import EditVaccination from "@/composant/EditVaccination";

export default function NewVaccination() {
  
  return (
    <div className="flex min-h-screen bg-green-50">
      <Sidebar />
      <main className="flex-1 p-6 space-y-8 ml-64 p-6">
      <EditVaccination/>     
      </main>
    </div>
  
  );
}