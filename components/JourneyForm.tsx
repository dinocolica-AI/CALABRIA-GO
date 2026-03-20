
import React, { useState, useMemo } from 'react';
import { SearchParams } from '../types';
import { reverseGeocode } from '../services/geminiService';

interface JourneyFormProps {
  onSubmit: (params: SearchParams, coords?: { lat: number; lng: number }) => void;
  loading: boolean;
}

const CALABRIA_DATA = {
  "Catanzaro (CZ)": ["Albi", "Amaroni", "Amato", "Andali", "Argusto", "Badolato", "Belcastro", "Borgia", "Botricello", "Caraffa di Catanzaro", "Cardinale", "Carlopoli", "Catanzaro", "Cenadi", "Centrache", "Cerva", "Chiaravalle Centrale", "Cicala", "Conflenti", "Cortale", "Cropani", "Curinga", "Davoli", "Decollatura", "Falerna", "Feroleto Antico", "Fossato Serralta", "Gagliato", "Gasperina", "Gimigliano", "Girifalco", "Givigliana", "Guardavalle", "Isca sullo Ionio", "Jacurso", "Lamezia Terme", "Magisano", "Maida", "Marcedusa", "Marcellinara", "Martirano", "Martirano Lombardo", "Miglierina", "Montauro", "Montepaone", "Nicastro", "Nocera Terinese", "Olivadi", "Palermiti", "Pentone", "Petrizzi", "Petronà", "Pianopoli", "Platania", "San Floro", "San Mango d'Aquino", "San Pietro a Maida", "San Pietro Apostolo", "San Sostene", "Santa Caterina dello Ionio", "Sant'Andrea Apostolo dello Ionio", "Satriano", "Sersale", "Settingiano", "Simeri Crichi", "Soverato", "Soveria Mannelli", "Soveria Simeri", "Squillace", "Stalettì", "Taverna", "Tiriolo", "Torre di Ruggiero", "Vallefiorita", "Zagarise"],
  "Cosenza (CS)": ["Acquaformosa", "Acquappesa", "Acri", "Aiello Calabro", "Aieta", "Albidona", "Alessandria del Carretto", "Altilia Grimaldi", "Altomonte", "Amantea", "Amendolara", "Aprigliano", "Belmonte Calabro", "Belsito", "Belvedere Marittimo", "Bianchi", "Bisignano", "Bocchigliero", "Bonifati", "Buonvicino", "Calopezzati", "Caloveto", "Campana", "Canna", "Cariati", "Carolei", "Carpanzano", "Casali del Manco", "Cassano all'Ionio", "Castiglione Cosentino", "Castrolibero", "Castroregio", "Castrovillari", "Celico", "Cellara", "Cerchiara di Calabria", "Cerisano", "Cervicati", "Cerzeto", "Cetraro", "Civita", "Cleto", "Colosimi", "Corigliano-Rossano", "Cosenza", "Cropalati", "Crosia", "Diamante", "Dipignano", "Domanico", "Fagnano Castello", "Falconara Albanese", "Figline Vegliaturo", "Firmo", "Fiumefreddo Bruzio", "Francavilla Marittima", "Frascineto", "Fuscaldo", "Grimaldi", "Guardia Piemontese", "Lago", "Laino Borgo", "Laino Castello", "Lappano", "Lattarico", "Longobardi", "Longobucco", "Lungro", "Luzzi", "Maierà", "Malito", "Malvito", "Mandatoriccio", "Mangone", "Marano Marchesato", "Marano Principato", "Marzi", "Mendicino", "Mongrassano", "Montalto Uffugo", "Montegiordano", "Morano Calabro", "Mormanno", "Mottafollone", "Nocara", "Oriolo", "Orsomarso", "Paludi", "Panettieri", "Paola", "Papasidero", "Parenti", "Paterno Calabro", "Pedivigliano", "Piane Crati", "Pietrafitta", "Pietrapaola", "Plataci", "Praia a Mare", "Rende", "Rocca Imperiale", "Roggiano Gravina", "Rogliano", "Rose", "Roseto Capo Spulico", "Rota Greca", "Rovito", "San Basile", "San Benedetto Ullano", "San Cosmo Albanese", "San Demetrio Corone", "San Donato di Ninea", "San Fili", "San Giorgio Albanese", "San Giovanni in Fiore", "San Lorenzo Bellizzi", "San Lorenzo del Vallo", "San Lucido", "San Marco Argentano", "San Martino di Finita", "San Nicola Arcella", "San Pietro in Amantea", "San Pietro in Guarano", "San Sosti", "San Vincenzo La Costa", "Sangineto", "Santa Caterina Albanese", "Santa Domenica Talao", "Santa Maria del Cedro", "Santa Sofia d'Epiro", "Santo Stefano di Rogliano", "Saracena", "Scala Coeli", "Scalea", "Scigliano", "Spezzano Albanese", "Spezzano della Sila", "Tarsia", "Terranova da Sibari", "Terravecchia", "Torano Castello", "Tortora", "Trebisacce", "Vaccarizzo Albanese", "Verbicaro", "Villapiana", "Zumpano"],
  "Crotone (KR)": ["Belvedere di Spinello", "Caccuri", "Carfizzi", "Casabona", "Castelsilano", "Cerenzia", "Cirò", "Cirò Marina", "Cotronei", "Crotone", "Crucoli", "Cutro", "Isola di Capo Rizzuto", "Melissa", "Mesoraca", "Pallagorio", "Petilia Policastro", "Rocca di Neto", "Roccabernarda", "San Mauro Marchesato", "San Nicola dell'Alto", "Santa Severina", "Savelli", "Scandale", "Strongoli", "Umbriatico", "Verzino"],
  "Reggio Calabria (RC)": ["Africo", "Agnana Calabra", "Anterivo", "Antonimina", "Ardore", "Bagaladi", "Bagnara Calabra", "Bovalino", "Brancaleone", "Bruzzano Zeffirio", "Calanna", "Camini", "Campo Calabro", "Candidoni", "Canolo", "Caraffa del Bianco", "Cardeto", "Careri", "Casignana", "Caulonia", "Ciminà", "Cinquefrondi", "Cittanova", "Condofuri", "Cosoleto", "Delianuova", "Feroleto della Chiesa", "Ferruzzano", "Fiumara", "Galatro", "Gerace", "Giffone", "Gioia Tauro", "Gioiosa Ionica", "Grotteria", "Laganadi", "Laureana di Borrello", "Locri", "Mammola", "Marina di Gioiosa Ionica", "Maropati", "Martone", "Melicuccà", "Melicucco", "Melito di Porto Salvo", "Molochio", "Monasterace", "Montebello Ionico", "Motta San Giovanni", "Oppido Mamertina", "Palizzi", "Palmi", "Pazzano", "Placanica", "Platì", "Polistena", "Portigliola", "Reggio Calabria", "Riace", "Rizziconi", "Roccaforte del Greco", "Roccella Ionica", "Roghudi", "Rosarno", "San Ferdinando", "San Giorgio Morgeto", "San Giovanni di Gerace", "San Lorenzo", "San Luca", "San Pietro di Caridà", "San Procopio", "San Roberto", "Santa Cristina d'Aspromonte", "Sant'Agata del Bianco", "Sant'Alessio in Aspromonte", "Sant'Eufemia d'Aspromonte", "Sant'Ilario dello Ionio", "Santo Stefano in Aspromonte", "Scido", "Scilla", "Seminara", "Serrata", "Siderno", "Sinopoli", "Staiti", "Stignano", "Stilo", "Taurianova", "Terranova Sappo Minulio", "Varapodio", "Villa San Giovanni"],
  "Vibo Valentia (VV)": ["Acquaro", "Arena", "Briatico", "Brognaturo", "Capistrano", "Cessaniti", "Dasà", "Dinami", "Drapia", "Fabrizia", "Filadelfia", "Filandari", "Filogaso", "Francavilla Angitola", "Francica", "Gerocarne", "Jonadi", "Joppolo", "Limbadi", "Maierato", "Mileto", "Mongiana", "Monterosso Calabro", "Nardodipace", "Nicotera", "Parghelia", "Pizzo", "Pizzoni", "Polia", "Ricadi", "Rombiolo", "San Calogero", "San Costantino Calabro", "San Gregorio d'Ippona", "San Nicola da Crissa", "Sant'Onofrio", "Serra San Bruno", "Simbario", "Sorianello", "Soriano Calabro", "Spadola", "Spilinga", "Stefanaconi", "Tropea", "Vallelonga", "Vazzano", "Vibo Valentia", "Zaccanopoli", "Zambrone", "Zungri"]
};

const JourneyForm: React.FC<JourneyFormProps> = ({ onSubmit, loading }) => {
  const [originCity, setOriginCity] = useState('');
  const [originStreet, setOriginStreet] = useState('');
  const [originNumber, setOriginNumber] = useState('');
  
  const [destinationCity, setDestinationCity] = useState('');
  const [destinationStreet, setDestinationStreet] = useState('');
  const [destinationNumber, setDestinationNumber] = useState('');

  const [departureTime, setDepartureTime] = useState(
    new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })
  );
  const [departureDate, setDepartureDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  
  const [fuelType, setFuelType] = useState<'benzina' | 'diesel' | 'gpl'>('diesel');
  const [consumption, setConsumption] = useState('6.0');

  const [locating, setLocating] = useState(false);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | undefined>();

  const flattenedCities = useMemo(() => {
    const list: string[] = [];
    Object.entries(CALABRIA_DATA).forEach(([province, cities]) => {
      cities.forEach(city => {
        list.push(`${city} (${province.split(' ')[0]})`);
      });
    });
    return list.sort();
  }, []);

  const handleGetLocation = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserCoords({ lat: latitude, lng: longitude });
        
        try {
          const cityName = await reverseGeocode(latitude, longitude);
          if (cityName) {
            setOriginCity(cityName);
          } else {
            setOriginCity("Posizione attuale");
          }
        } catch (err) {
          setOriginCity("Posizione attuale");
        }
        
        setOriginStreet("");
        setOriginNumber("");
        setLocating(false);
      },
      () => {
        setLocating(false);
        alert("Posizione non disponibile. Controlla i permessi del browser.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!originCity || !destinationCity) return;
    
    // Puliamo le città da eventuali province tra parentesi prima di inviare a Gemini
    const cleanOrigin = originCity.split(' (')[0];
    const cleanDest = destinationCity.split(' (')[0];

    onSubmit({ 
      originCity: cleanOrigin, originStreet, originNumber,
      destinationCity: cleanDest, destinationStreet, destinationNumber,
      departureTime, departureDate,
      fuelType, consumption
    }, userCoords);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 max-w-4xl mx-auto -mt-12 relative z-10 space-y-8">
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Partenza */}
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b border-gray-100 pb-2">
            <h3 className="text-sm font-bold text-blue-600 uppercase tracking-wider flex items-center gap-2">
              <i className="fa-solid fa-circle-dot"></i> Partenza
            </h3>
            <button 
              type="button" 
              onClick={handleGetLocation}
              className={`text-[10px] font-bold px-2 py-1 rounded transition-colors ${
                userCoords ? 'bg-emerald-100 text-emerald-700' : 'text-blue-600 hover:bg-blue-50 border border-blue-100'
              }`}
            >
              <i className={`fa-solid ${locating ? 'fa-spinner animate-spin' : 'fa-location-crosshairs'}`}></i>
              {userCoords ? ' POSIZIONE OK' : ' USA GPS'}
            </button>
          </div>
          <div className="space-y-3">
            <input
              list="cities-list"
              type="text"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="Città (es. Cosenza)"
              value={originCity}
              onChange={(e) => {
                setOriginCity(e.target.value);
                if (userCoords) setUserCoords(undefined);
              }}
              required
            />
            {userCoords && (
              <p className="text-[10px] text-emerald-600 font-medium ml-2 animate-pulse">
                <i className="fa-solid fa-check-double"></i> Posizione rilevata. Modificala se non è corretta.
              </p>
            )}
            <div className="flex gap-2">
              <input
                type="text"
                className="flex-[3] px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="Via o Piazza"
                value={originStreet}
                onChange={(e) => setOriginStreet(e.target.value)}
              />
              <input
                type="text"
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="N."
                value={originNumber}
                onChange={(e) => setOriginNumber(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Destinazione */}
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b border-gray-100 pb-2">
            <h3 className="text-sm font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-2">
              <i className="fa-solid fa-location-dot"></i> Destinazione
            </h3>
          </div>
          <div className="space-y-3">
            <input
              list="cities-list"
              type="text"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              placeholder="Destinazione (es. Altilia)"
              value={destinationCity}
              onChange={(e) => setDestinationCity(e.target.value)}
              required
            />
            <div className="flex gap-2">
              <input
                type="text"
                className="flex-[3] px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                placeholder="Via o Piazza"
                value={destinationStreet}
                onChange={(e) => setDestinationStreet(e.target.value)}
              />
              <input
                type="text"
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                placeholder="N."
                value={destinationNumber}
                onChange={(e) => setDestinationNumber(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 border-t border-gray-100 pt-6">
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase ml-2">Giorno Viaggio</label>
          <input
            type="date"
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
            value={departureDate}
            onChange={(e) => setDepartureDate(e.target.value)}
            required
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase ml-2">Orario Partenza</label>
          <input
            type="time"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
            value={departureTime}
            onChange={(e) => setDepartureTime(e.target.value)}
            required
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase ml-2">Carburante</label>
          <select
            className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            value={fuelType}
            onChange={(e) => setFuelType(e.target.value as any)}
            required
          >
            <option value="benzina">Benzina</option>
            <option value="diesel">Diesel</option>
            <option value="gpl">GPL</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase ml-2">Consumo (L/100km)</label>
          <input
            type="number"
            step="0.1"
            min="1"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
            value={consumption}
            onChange={(e) => setConsumption(e.target.value)}
            required
          />
        </div>
        <div className="flex items-end">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl font-bold shadow-lg hover:from-blue-700 hover:to-blue-900 transition-all flex items-center justify-center gap-2"
          >
            {loading ? <i className="fa-solid fa-circle-notch animate-spin"></i> : <i className="fa-solid fa-route"></i>}
            CALCOLA
          </button>
        </div>
      </div>

      <datalist id="cities-list">
        {flattenedCities.map(city => <option key={city} value={city} />)}
      </datalist>
    </form>
  );
};

export default JourneyForm;
