
export interface TrainTransfer {
  station: string;
  arrivalTime: string;
  departureTime: string;
  waitDuration: string;
}

export interface TrainOption {
  departureTime: string;
  arrivalTime: string;
  duration: string;
  changes: number;
  departureStation: string;
  arrivalStation: string;
  transfers?: TrainTransfer[];
  routeCoordinates?: [number, number][];
}

export interface WeatherInfo {
  temp: string;
  condition: string;
  description: string;
  icon: string;
}

export interface JourneyInfo {
  origin: string; 
  destination: string; 
  distance: string;
  duration: string;
  departureTime: string;
  departureDate?: string;
  arrivalTime: string;
  routeCoordinates?: [number, number][];
  weatherAtDeparture: WeatherInfo;
  weatherAtArrival: WeatherInfo;
  fuelCost?: {
    amount: string;
    pricePerLiter: string;
    consumption: string;
  };
  weatherAlert?: {
    level: 'verde' | 'gialla' | 'arancione' | 'rossa' | 'nessuna';
    message: string;
    link?: string;
  };
  trainAlternative?: {
    available: boolean;
    departureStation?: string;
    arrivalStation?: string;
    options?: TrainOption[];
    description?: string;
    note?: string;
  };
  googleMapsUrl?: string;
  sources: Array<{ title: string; uri: string }>;
  mapsSources?: Array<{ title: string; uri: string }>;
}

export interface SearchParams {
  originCity: string;
  originStreet: string;
  originNumber: string;
  destinationCity: string;
  destinationStreet: string;
  destinationNumber: string;
  departureTime: string;
  departureDate: string;
  fuelType: 'benzina' | 'diesel' | 'gpl';
  consumption: string;
}

export enum AppStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
