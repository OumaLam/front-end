import AnimalForm from '@/composant/AnimalForm';
import Sidebar from '@/composant/Sidebar';

export default function NewAnimalPage() {
  
  return (
    <div className="flex min-h-screen bg-green-50">
      <Sidebar  />
      <main className="flex-1 p-6 space-y-8 ml-64 p-6">
      <AnimalForm />
      
      </main>
    </div>
  
  );
}
