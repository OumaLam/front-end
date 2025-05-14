 import AnimalForm from "@/composant/AnimalForm";

export default function EditAnimalPage({ params }: { params: { id: string } }) {
  return <AnimalForm id={params.id} />;
}
 