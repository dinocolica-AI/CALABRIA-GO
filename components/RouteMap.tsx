
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with React
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface RouteMapProps {
  origin: string;
  destination: string;
  routeCoordinates?: [number, number][];
  trainRouteCoordinates?: [number, number][];
  googleMapsUrl?: string;
}

const FitBounds: React.FC<{ coords: [number, number][], priorityCoords: [number, number][] }> = ({ coords, priorityCoords }) => {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 100);
    
    if (priorityCoords.length > 0) {
      const bounds = L.latLngBounds(priorityCoords);
      map.fitBounds(bounds, { padding: [50, 50] });
    } else if (coords.length > 0) {
      const bounds = L.latLngBounds(coords);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
    
    return () => clearTimeout(timer);
  }, [coords, priorityCoords, map]);
  return null;
};

const RouteMap: React.FC<RouteMapProps> = ({ origin, destination, routeCoordinates = [], trainRouteCoordinates = [], googleMapsUrl }) => {
  const [mapType, setMapType] = useState<'streets' | 'satellite'>('streets');
  const allCoords = [...routeCoordinates, ...trainRouteCoordinates];
  const center: [number, number] = routeCoordinates.length > 0 ? routeCoordinates[0] : [39.0, 16.5]; // Centro della Calabria

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="bg-slate-800 p-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-map-location-dot"></i>
            <span className="font-bold uppercase tracking-wider text-xs">Mappa Itinerari</span>
          </div>
          <button 
            onClick={() => setMapType(mapType === 'streets' ? 'satellite' : 'streets')}
            className="bg-white/10 hover:bg-white/20 px-2 py-1 rounded text-[10px] font-bold uppercase transition-colors flex items-center gap-1"
          >
            <i className={`fa-solid ${mapType === 'streets' ? 'fa-satellite' : 'fa-map'}`}></i>
            {mapType === 'streets' ? 'Satellite' : 'Mappa'}
          </button>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-1 bg-blue-500 rounded-full"></div>
            <span className="text-[10px] font-bold uppercase text-blue-200">Auto</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-1 bg-black rounded-full"></div>
            <span className="text-[10px] font-bold uppercase text-gray-300">Treno</span>
          </div>
        </div>
      </div>
      
      <div className="aspect-video w-full relative bg-gray-100 min-h-[300px]">
        <MapContainer 
          key={`${allCoords.length}-${mapType}`}
          center={center} 
          zoom={8} 
          style={{ height: '100%', width: '100%' }}
        >
          {mapType === 'streets' ? (
            <TileLayer
              attribution='&copy; <a href="https://www.google.com/help/terms_maps.html">Google Maps</a>'
              url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
            />
          ) : (
            <TileLayer
              attribution='&copy; <a href="https://www.google.com/help/terms_maps.html">Google Maps</a>'
              url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
            />
          )}
          
          {allCoords.length > 0 && <FitBounds coords={allCoords} priorityCoords={routeCoordinates} />}
          
          {routeCoordinates && routeCoordinates.length > 0 && (
            <>
              <Polyline 
                positions={routeCoordinates} 
                color="#3b82f6" 
                weight={6} 
                opacity={0.8} 
                smoothFactor={1}
              />
              <Marker position={routeCoordinates[0]}>
                <Popup>Partenza: {origin}</Popup>
              </Marker>
              <Marker position={routeCoordinates[routeCoordinates.length - 1]}>
                <Popup>Arrivo: {destination}</Popup>
              </Marker>
            </>
          )}

          {trainRouteCoordinates && trainRouteCoordinates.length > 2 && (
            <Polyline 
              positions={trainRouteCoordinates} 
              color="black" 
              weight={4} 
              dashArray="8, 12" 
              opacity={0.9} 
              smoothFactor={1}
            />
          )}
        </MapContainer>
      </div>

      <div className="p-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-4 text-[10px] text-gray-500 italic">
        <div className="flex items-center gap-1">
          <i className="fa-solid fa-circle-info"></i>
          <span>Percorso treno evidenziato in nero tratteggiato</span>
        </div>
        {googleMapsUrl && (
          <a 
            href={googleMapsUrl} 
            target="_blank" 
            rel="noreferrer"
            className="not-italic bg-blue-600 text-white px-3 py-1 rounded-lg font-bold flex items-center gap-1 hover:bg-blue-700 transition-colors"
          >
            <i className="fa-solid fa-map"></i> Apri in Google Maps
          </a>
        )}
      </div>
    </div>
  );
};

export default RouteMap;
