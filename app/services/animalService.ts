import axios from '@/app/lib/axios';

export const getAnimals = () => axios.get('/animals');
export const getAnimalById = (id: string) => axios.get(`/animals/${id}`);
export const createAnimal = (data: any) => axios.post('/animals/new', data);
export const updateAnimal = (id: string, data: any) => axios.put(`/animals/${id}`, data);
