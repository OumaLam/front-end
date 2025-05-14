'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoadingPage from '@/composant/LoadingPage';

export default function Home() {
    const router = useRouter();

    useEffect(() => {
       
        // Si aucun token n'est trouvé, redirection vers la page de connexion
        
            router.push('/login');
       
    }, [router]);

    return <div><LoadingPage/></div>; // Indicateur de chargement
}