
import React, { useState } from 'react';
import Header from './components/Header';
import JourneyForm from './components/JourneyForm';
import JourneyResult from './components/JourneyResult';
import { getTravelData } from './services/geminiService';
import { JourneyInfo, SearchParams, AppStatus } from './types';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [journeyData, setJourneyData] = useState<JourneyInfo | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleSearch = async (params: SearchParams, coords?: { lat: number; lng: number }) => {
    setStatus(AppStatus.LOADING);
    setErrorMessage('');
    
    try {
      const data = await getTravelData(params, coords);
      setJourneyData(data);
      setStatus(AppStatus.SUCCESS);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Si è verificato un errore imprevisto.');
      setStatus(AppStatus.ERROR);
    }
  };

  return (
    <div className="min-h-screen pb-20 bg-slate-50">
      <Header />
      
      <main className="container mx-auto px-4">
        <JourneyForm onSubmit={handleSearch} loading={status === AppStatus.LOADING} />

        {status === AppStatus.ERROR && (
          <div className="mt-12 max-w-2xl mx-auto bg-white border border-red-100 p-8 rounded-3xl shadow-xl animate-in zoom-in-95 duration-300">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <i className="fa-solid fa-hourglass-half text-red-500 text-2xl animate-pulse"></i>
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-900 mb-2">Ops! Qualcosa è andato storto</h3>
                <p className="text-gray-600 leading-relaxed">{errorMessage}</p>
              </div>
              <button 
                onClick={() => setStatus(AppStatus.IDLE)}
                className="mt-4 px-8 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-colors shadow-lg shadow-red-200"
              >
                Ho capito, riprovo
              </button>
            </div>
          </div>
        )}

        {status === AppStatus.IDLE && (
          <div className="mt-20 text-center text-gray-400 opacity-60 animate-in fade-in duration-700">
            <div className="text-6xl mb-4">
              <i className="fa-solid fa-map-location-dot"></i>
            </div>
            <p className="text-xl font-medium">Inserisci i luoghi per calcolare rotta e meteo</p>
            <p className="text-sm">Servizio ottimizzato per la regione Calabria</p>
          </div>
        )}

        {status === AppStatus.SUCCESS && journeyData && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <JourneyResult info={journeyData} />
          </div>
        )}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-200 py-4 z-20">
        <div className="container mx-auto px-4 flex justify-between items-center text-gray-500 text-sm">
          <p>© 2024 Calabria Travel Explorer</p>
          <p className="flex items-center gap-2">
            Made for <span className="font-bold text-blue-600">Calabria</span> 
            <i className="fa-solid fa-heart text-red-500"></i>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
