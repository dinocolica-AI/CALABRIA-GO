
import React from 'react';
import { JourneyInfo, WeatherInfo } from '../types';
import RouteMap from './RouteMap';

interface JourneyResultProps {
  info: JourneyInfo;
}

const WeatherCard: React.FC<{ title: string; city: string; time: string; weather: WeatherInfo; gradient: string }> = ({ title, city, time, weather, gradient }) => (
  <div className={`bg-gradient-to-br ${gradient} rounded-3xl shadow-xl p-6 text-white relative overflow-hidden group flex-1`}>
    <i className={`fa-solid ${weather.icon} absolute -bottom-4 -right-4 text-8xl text-white/10 rotate-12 transition-transform group-hover:scale-110`}></i>
    <div className="relative z-10">
      <h4 className="text-white/70 font-bold uppercase text-[10px] tracking-widest mb-1 flex items-center gap-2">
        <i className="fa-solid fa-clock"></i> {title} ({time})
      </h4>
      <h3 className="text-xl font-black mb-1 truncate">{city}</h3>
      <div className="flex items-center gap-4 mt-4">
        <i className={`fa-solid ${weather.icon} text-4xl`}></i>
        <div>
          <p className="text-4xl font-black leading-none">{weather.temp}</p>
          <p className="text-[10px] font-bold uppercase opacity-80">{weather.condition}</p>
        </div>
      </div>
      <p className="mt-4 text-sm opacity-90 leading-tight">{weather.description}</p>
    </div>
  </div>
);

const JourneyResult: React.FC<JourneyResultProps> = ({ info }) => {
  const formattedDate = info.departureDate 
    ? new Date(info.departureDate).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })
    : '';

  const originCityOnly = info.origin.split(',').find(p => !p.includes('Via') && !p.includes('Piazza')) || info.origin.split(',').pop()?.trim() || "";
  const destCityOnly = info.destination.split(',').find(p => !p.includes('Via') && !p.includes('Piazza')) || info.destination.split(',').pop()?.trim() || "";
  
  const alertColors = {
    verde: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    gialla: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    arancione: 'bg-orange-50 border-orange-200 text-orange-800',
    rossa: 'bg-red-50 border-red-200 text-red-800',
    nessuna: 'hidden'
  };

  const alertIcons = {
    verde: 'fa-circle-check',
    gialla: 'fa-triangle-exclamation',
    arancione: 'fa-circle-exclamation',
    rossa: 'fa-biohazard',
    nessuna: ''
  };

  return (
    <div className="mt-8 max-w-5xl mx-auto space-y-6 pb-24">
      
      {info.weatherAlert && info.weatherAlert.level !== 'nessuna' && info.weatherAlert.level !== 'verde' && (
        <div className={`p-4 rounded-2xl border flex items-start gap-4 animate-in slide-in-from-top-2 duration-500 ${alertColors[info.weatherAlert.level]}`}>
          <div className="mt-1">
            <i className={`fa-solid ${alertIcons[info.weatherAlert.level]} text-xl`}></i>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-black uppercase text-xs tracking-wider">Allerta Meteo Protezione Civile - Livello {info.weatherAlert.level}</h4>
              {info.weatherAlert.link && (
                <a href={info.weatherAlert.link} target="_blank" className="text-[10px] font-bold underline opacity-70 hover:opacity-100">Dettagli Ufficiali</a>
              )}
            </div>
            <p className="text-sm font-medium leading-relaxed">{info.weatherAlert.message}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Car Card - Dettagli Viaggio */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden flex flex-col">
          <div className="bg-blue-600 p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-car"></i>
              <span className="font-bold uppercase tracking-wider text-xs">Percorso Stradale Esatto</span>
            </div>
            <div className="flex items-center gap-2">
              {info.googleMapsUrl && (
                <a 
                  href={info.googleMapsUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-[10px] bg-white/20 hover:bg-white/30 px-2 py-0.5 rounded-full font-bold flex items-center gap-1 transition-colors"
                >
                  <i className="fa-solid fa-up-right-from-square"></i> Google Maps
                </a>
              )}
              {formattedDate && <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold">{formattedDate}</span>}
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="flex justify-between items-end border-b border-gray-50 pb-6">
              <div className="space-y-1">
                <p className="text-sm font-bold text-gray-400 uppercase tracking-tighter">Partenza da</p>
                <p className="text-gray-800 font-medium leading-tight">{info.origin}</p>
              </div>
              <div className="text-right space-y-1">
                <p className="text-sm font-bold text-gray-400 uppercase tracking-tighter">Arrivo a</p>
                <p className="text-gray-800 font-medium leading-tight">{info.destination}</p>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <p className="text-4xl font-black text-gray-900 tracking-tighter">{info.distance}</p>
                <p className="text-gray-400 text-[10px] font-bold uppercase">Km stimati</p>
              </div>
              <div className="h-12 w-[1px] bg-gray-100"></div>
              <div className="text-center">
                <p className="text-4xl font-black text-blue-600 tracking-tighter">{info.duration}</p>
                <p className="text-gray-400 text-[10px] font-bold uppercase">Tempo totale</p>
              </div>
              <div className="h-12 w-[1px] bg-gray-100"></div>
              <div className="text-right">
                <p className="text-xl font-bold text-gray-700">{info.departureTime} <i className="fa-solid fa-arrow-right text-xs mx-1 text-gray-300"></i> {info.arrivalTime}</p>
                <p className="text-gray-400 text-[10px] font-bold uppercase">Fascia oraria</p>
              </div>
            </div>

            {info.fuelCost && (
              <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between bg-orange-50/50 -mx-6 px-6 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                    <i className="fa-solid fa-gas-pump text-sm"></i>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-orange-400 uppercase leading-none">Costo Carburante Stimato</p>
                    <p className="text-xs text-gray-500">Basato su {info.fuelCost.consumption} e {info.fuelCost.pricePerLiter}/L</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-orange-600 tracking-tighter">{info.fuelCost.amount}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Train Card */}
        <div className={`rounded-3xl shadow-xl border overflow-hidden flex flex-col ${
          info.trainAlternative?.available ? 'bg-white border-indigo-100' : 'bg-gray-50 border-gray-200 opacity-80'
        }`}>
          <div className={`${info.trainAlternative?.available ? 'bg-indigo-700' : 'bg-gray-500'} p-4 text-white flex items-center gap-2`}>
            <i className="fa-solid fa-train-subway"></i>
            <span className="font-bold uppercase tracking-wider text-xs">Alternativa Treno</span>
          </div>
          
          <div className="p-5 flex-1 flex flex-col">
            {info.trainAlternative?.available ? (
              <div className="space-y-6">
                {info.trainAlternative.options?.slice(0, 2).map((opt, i) => (
                  <div key={i} className="space-y-3 border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <p className="text-[9px] font-bold text-gray-400 uppercase leading-none">Partenza</p>
                        <p className="text-xs font-black text-indigo-700">{opt.departureTime}</p>
                        <p className="text-[10px] text-gray-600 font-medium leading-tight">{opt.departureStation}</p>
                      </div>
                      <div className="flex flex-col items-center px-2">
                        <div className="h-4 w-[1px] bg-gray-200"></div>
                        <p className="text-[8px] font-bold text-gray-300 uppercase my-1">{opt.duration}</p>
                        <div className="h-4 w-[1px] bg-gray-200"></div>
                      </div>
                      <div className="text-right space-y-1">
                        <p className="text-[9px] font-bold text-gray-400 uppercase leading-none">Arrivo</p>
                        <p className="text-xs font-black text-indigo-700">{opt.arrivalTime}</p>
                        <p className="text-[10px] text-gray-600 font-medium leading-tight">{opt.arrivalStation}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ${opt.changes === 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>
                        {opt.changes === 0 ? 'DIRETTO' : `${opt.changes} CAMBI`}
                      </span>
                    </div>

                    {opt.transfers && opt.transfers.length > 0 && (
                      <div className="bg-gray-50 rounded-xl p-3 space-y-2">
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Dettagli Cambi</p>
                        {opt.transfers.map((t, ti) => (
                          <div key={ti} className="flex items-center gap-3 text-[10px]">
                            <div className="w-1.5 h-1.5 rounded-full bg-orange-400"></div>
                            <div className="flex-1">
                              <p className="font-bold text-gray-700">{t.station}</p>
                              <p className="text-gray-500">Arrivo {t.arrivalTime} • Partenza {t.departureTime} ({t.waitDuration} attesa)</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                {info.trainAlternative.note && (
                  <p className="text-[9px] text-gray-400 italic leading-tight">{info.trainAlternative.note}</p>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <i className="fa-solid fa-train-slash text-gray-300 text-3xl mb-2"></i>
                <p className="text-gray-500 text-xs font-bold">Nessun treno disponibile per questo orario/tratta.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Weather Section - Dual Column */}
      <div className="flex flex-col md:flex-row gap-6">
        <WeatherCard 
          title="Meteo Partenza" 
          city={originCityOnly} 
          time={info.departureTime} 
          weather={info.weatherAtDeparture} 
          gradient="from-slate-600 to-slate-800"
        />
        <WeatherCard 
          title="Meteo Arrivo" 
          city={destCityOnly} 
          time={info.arrivalTime} 
          weather={info.weatherAtArrival} 
          gradient="from-emerald-500 to-teal-600"
        />
      </div>

      <RouteMap 
        origin={info.origin} 
        destination={info.destination} 
        routeCoordinates={info.routeCoordinates}
        trainRouteCoordinates={info.trainAlternative?.options?.[0]?.routeCoordinates}
        googleMapsUrl={info.googleMapsUrl}
      />

      {(info.sources.length > 0 || (info.mapsSources && info.mapsSources.length > 0)) && (
        <div className="px-6 flex flex-wrap items-center gap-4 text-gray-400">
          <span className="text-[10px] font-bold uppercase">Fonti e Luoghi:</span>
          {info.mapsSources?.map((s, i) => (
            <a key={`map-${i}`} href={s.uri} target="_blank" rel="noreferrer" className="text-[10px] text-blue-400 hover:text-blue-500 underline flex items-center gap-1">
              <i className="fa-solid fa-location-dot"></i> {s.title}
            </a>
          ))}
          {info.sources.map((s, i) => (
            <a key={`web-${i}`} href={s.uri} target="_blank" rel="noreferrer" className="text-[10px] hover:text-blue-500 underline">{s.title.substring(0, 30)}...</a>
          ))}
        </div>
      )}
    </div>
  );
};

export default JourneyResult;
