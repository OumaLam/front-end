import Sidebar from '@/composant/Sidebar';
import AnimalDetails from '@/composant/AnimalDetails';

export default function DetailleAnimalPage( { params }: { params: { idAnimal: string }}) {
  
  return (
    <div className="flex min-h-screen bg-green-50">
      <Sidebar />
      <main className="flex-1 p-6 space-y-8 ml-64 p-6">
      <AnimalDetails  animalId={params.idAnimal}/>
      
      </main>
    </div>
  
  );
}
