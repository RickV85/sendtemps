export interface Coords {
  latitude: string;
  longitude: string;
}

export interface LocationDetails {
  "@context": [
    string,
    {
      "@version": string;
      wx: string;
      s: string;
      geo: string;
      unit: string;
      "@vocab": string;
      geometry: {
        "@id": string;
        "@type": string;
      };
      city: string;
      state: string;
      distance: {
        "@id": string;
        "@type": string;
      };
      bearing: {
        "@type": string;
      };
      value: {
        "@id": string;
      };
      unitCode: {
        "@id": string;
        "@type": string;
      };
      forecastOffice: {
        "@type": string;
      };
      forecastGridData: {
        "@type": string;
      };
      publicZone: {
        "@type": string;
      };
      county: {
        "@type": string;
      };
    }
  ];
  id: string;
  type: string;
  geometry: {
    type: string;
    coordinates: number[];
  };
  properties: {
    "@id": string;
    "@type": string;
    cwa: string;
    forecastOffice: string;
    gridId: string;
    gridX: number;
    gridY: number;
    forecast: string;
    forecastHourly: string;
    forecastGridData: string;
    observationStations: string;
    relativeLocation: {
      type: string;
      geometry: {
        type: string;
        coordinates: number[];
      };
      properties: {
        city: string;
        state: string;
        distance: {
          unitCode: string;
          value: number;
        };
        bearing: {
          unitCode: string;
          value: number;
        };
      };
    };
    forecastZone: string;
    county: string;
    fireWeatherZone: string;
    timeZone: string;
    radarStation: string;
  };
}

export interface ForecastData {
  "@context": [
    string,
    {
      "@version": string;
      wx: string;
      geo: string;
      unit: string;
      "@vocab": string;
    }
  ];
  type: string;
  geometry: {
    type: string;
    coordinates: [[number, number][]];
  };
  properties: {
    updated: string;
    units: string;
    forecastGenerator: string;
    generatedAt: string;
    updateTime: string;
    validTimes: string;
    elevation: {
      unitCode: string;
      value: number;
    };
    periods: {
      number: number;
      name: string;
      startTime: string;
      endTime: string;
      isDaytime: boolean;
      temperature: number;
      temperatureUnit: string;
      temperatureTrend: null;
      probabilityOfPrecipitation: {
        unitCode: string;
        value: number | null;
      };
      dewpoint: {
        unitCode: string;
        value: number;
      };
      relativeHumidity: {
        unitCode: string;
        value: number;
      };
      windSpeed: string;
      windDirection: string;
      icon: string;
      shortForecast: string;
      detailedForecast: string;
    }[];
  };
}

export interface HourlyForecastData {
  "@context": Array<string | {
    "@version": string,
    "wx": string,
    "geo": string,
    "unit": string,
    "@vocab": string
  }>;
  type: string;
  geometry: {
    type: string;
    coordinates: number[][][];
  };
  properties: {
    updated: string;
    units: string;
    forecastGenerator: string;
    generatedAt: string;
    updateTime: string;
    validTimes: string;
    elevation: {
      unitCode: string;
      value: number;
    };
    periods: Array<{
      number: number;
      name: string;
      startTime: string;
      endTime: string;
      isDaytime: boolean;
      temperature: number;
      temperatureUnit: string;
      temperatureTrend: null;
      probabilityOfPrecipitation: {
        unitCode: string;
        value: number | null;
      };
      dewpoint: {
        unitCode: string;
        value: number;
      };
      relativeHumidity: {
        unitCode: string;
        value: number;
      };
      windSpeed: string;
      windDirection: string;
      icon: string;
      shortForecast: string;
      detailedForecast: string;
    }>;
  };
}


export interface LocationObject {
  id: number;
  latitude: string;
  longitude: string;
  name: string;
  poi_type: string;
}

export interface UserSessionInfo {
  id: string;
  email: string;
  name: string;
  image: string;
}

export interface GoogleMapPoint {
  name: string;
  coords: {
    lat: number;
    lng: number;
  };
}