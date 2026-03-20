
import { GoogleGenAI, Type } from "@google/genai";
import { SearchParams, JourneyInfo } from "../types";

export const getTravelData = async (params: SearchParams, userCoords?: { lat: number; lng: number }): Promise<JourneyInfo> => {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || process.env.API_KEY });
  const modelName = "gemini-3-flash-preview";

  const originFull = `${params.originStreet} ${params.originNumber}, ${params.originCity}`.trim();
  const destFull = `${params.destinationStreet} ${params.destinationNumber}, ${params.destinationCity}`.trim();

  const prompt = `Sei un assistente di viaggio esperto per la regione Calabria. 
  Pianifica un viaggio il ${params.departureDate} da ${originFull} a ${destFull} con partenza alle ${params.departureTime}.

  DETTAGLI VEICOLO:
  - Carburante: ${params.fuelType}
  - Consumo dichiarato: ${params.consumption} L/100km

  REGOLE DI OUTPUT:
  - Restituisci SOLO un oggetto JSON valido.
  - Il campo 'routeCoordinates' deve seguire le strade reali.
  - Il campo 'trainAlternative' deve contenere opzioni reali se disponibili.

  CALCOLO COSTI:
  - Usa Google Search per trovare il prezzo attuale del ${params.fuelType} in Calabria.
  - Calcola il costo totale basandoti sulla distanza e sul consumo di ${params.consumption} L/100km.

  STRUTTURA JSON:
  {
    "origin": "${originFull}",
    "destination": "${destFull}",
    "distance": "string",
    "duration": "string",
    "departureTime": "${params.departureTime}",
    "departureDate": "${params.departureDate}",
    "arrivalTime": "string",
    "googleMapsUrl": "string",
    "routeCoordinates": [[lat, lng], ...],
    "weatherAtDeparture": { "temp": "string", "condition": "string", "description": "string", "icon": "string" },
    "weatherAtArrival": { "temp": "string", "condition": "string", "description": "string", "icon": "string" },
    "fuelCost": { "amount": "string", "pricePerLiter": "string", "consumption": "${params.consumption} L/100km" },
    "weatherAlert": { "level": "verde"|"gialla"|"arancione"|"rossa"|"nessuna", "message": "string", "link": "string" },
    "trainAlternative": {
      "available": boolean,
      "departureStation": "string",
      "arrivalStation": "string",
      "options": [
        {
          "departureTime": "string",
          "arrivalTime": "string",
          "duration": "string",
          "changes": number,
          "departureStation": "string",
          "arrivalStation": "string",
          "transfers": [{ "station": "string", "arrivalTime": "string", "departureTime": "string", "waitDuration": "string" }],
          "routeCoordinates": [[lat, lng], ...]
        }
      ],
      "note": "string"
    }
  }`;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.2,
        responseMimeType: "application/json"
      },
    });

    const text = response.text;
    if (!text) {
      console.error("Empty response from Gemini. Full response:", JSON.stringify(response));
      throw new Error("Il servizio non ha restituito dati. Riprova.");
    }
    
    let parsedData;
    try {
      parsedData = JSON.parse(text);
    } catch (parseError) {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Errore nel formato dei dati. Riprova.");
      }
    }

    const sources: Array<{title: string, uri: string}> = [];
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (groundingChunks) {
      groundingChunks.forEach((chunk: any) => {
        if (chunk.web) {
          sources.push({ title: chunk.web.title || "Info", uri: chunk.web.uri });
        }
      });
    }

    return {
      ...parsedData,
      sources: sources.filter((v, i, a) => a.findIndex(t => (t.uri === v.uri)) === i).slice(0, 4),
      mapsSources: []
    };
  } catch (error: any) {
    console.error("Travel Data Error:", error);
    if (error.message?.includes("429") || error.message?.toLowerCase().includes("quota")) {
      throw new Error("Limite di richieste raggiunto. Riprova tra un minuto.");
    }
    throw new Error(error.message || "Impossibile calcolare il percorso. Riprova.");
  }
};

export const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || process.env.API_KEY });
  const modelName = "gemini-3-flash-preview";

  const prompt = `Dati i seguenti coordinate: latitudine ${lat}, longitudine ${lng}, dimmi solo il nome del comune (e provincia tra parentesi) in Calabria in cui si trovano. Esempio: "Pizzo (VV)". Non aggiungere altro testo.`;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        temperature: 0.1,
      },
    });

    return response.text?.trim() || "";
  } catch (error) {
    console.error("Reverse Geocode Error:", error);
    return "";
  }
};
