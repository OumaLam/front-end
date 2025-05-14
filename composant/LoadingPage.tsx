import React from 'react';
import Lottie from 'lottie-react';

const LoadingPage = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-48 h-48">
<Lottie animationData={require('../public/loading.json')} loop={true} />
        </div>
        <p className="text-lg text-gray-600 font-medium">Chargement des données...</p>
      </div>
    </div>
  );
};

export default LoadingPage;
