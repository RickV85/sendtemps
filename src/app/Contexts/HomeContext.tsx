'use client';
import React, { createContext, useMemo, useState } from 'react';
import { Coords, ForecastSendScores, HourlyForecastParams } from '../Interfaces/interfaces';
import { Gridpoint } from '../Classes/Gridpoint';
import { Forecast } from '../Classes/Forecast';
import { HourlyForecast } from '../Classes/HourlyForecast';

interface HomeContextType {
  currentGPSCoords: Coords | undefined;
  setCurrentGPSCoords: React.Dispatch<React.SetStateAction<Coords | undefined>>;
  selectedLocCoords: string;
  setSelectedLocCoords: React.Dispatch<React.SetStateAction<string>>;
  selectedLocType: string;
  setSelectedLocType: React.Dispatch<React.SetStateAction<string>>;
  locationDetails: Gridpoint | undefined;
  setLocationDetails: React.Dispatch<React.SetStateAction<Gridpoint | undefined>>;
  forecastData: Forecast | undefined;
  setForecastData: React.Dispatch<React.SetStateAction<Forecast | undefined>>;
  hourlyForecastData: HourlyForecast | undefined;
  setHourlyForecastData: React.Dispatch<React.SetStateAction<HourlyForecast | undefined>>;
  hourlyForecastParams: HourlyForecastParams | undefined;
  setHourlyForecastParams: React.Dispatch<React.SetStateAction<HourlyForecastParams | undefined>>;
  forecastSendScores: ForecastSendScores | undefined;
  setForecastSendScores: React.Dispatch<React.SetStateAction<ForecastSendScores | undefined>>;
  screenWidth: number;
  setScreenWidth: React.Dispatch<React.SetStateAction<number>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  pageLoaded: boolean;
  setPageLoaded: React.Dispatch<React.SetStateAction<boolean>>;
  error: string;
  setError: React.Dispatch<React.SetStateAction<string>>;
}

export const HomeContext = createContext<HomeContextType>({
  currentGPSCoords: undefined,
  setCurrentGPSCoords: () => {},
  selectedLocCoords: '',
  setSelectedLocCoords: () => {},
  selectedLocType: '',
  setSelectedLocType: () => {},
  locationDetails: undefined,
  setLocationDetails: () => {},
  forecastData: undefined,
  setForecastData: () => {},
  hourlyForecastData: undefined,
  setHourlyForecastData: () => {},
  hourlyForecastParams: undefined,
  setHourlyForecastParams: () => {},
  forecastSendScores: undefined,
  setForecastSendScores: () => {},
  screenWidth: 0,
  setScreenWidth: () => {},
  isLoading: false,
  setIsLoading: () => {},
  pageLoaded: false,
  setPageLoaded: () => {},
  error: '',
  setError: () => {},
});

interface HomeProviderProps {
  children: React.ReactNode;
}

export const HomeProvider: React.FC<HomeProviderProps> = ({ children }) => {
  const [currentGPSCoords, setCurrentGPSCoords] = useState<Coords>();
  const [selectedLocCoords, setSelectedLocCoords] = useState<string>('');
  const [selectedLocType, setSelectedLocType] = useState<string>('');
  const [locationDetails, setLocationDetails] = useState<Gridpoint>();
  const [forecastData, setForecastData] = useState<Forecast>();
  const [hourlyForecastData, setHourlyForecastData] = useState<HourlyForecast>();
  const [hourlyForecastParams, setHourlyForecastParams] = useState<HourlyForecastParams>();
  const [forecastSendScores, setForecastSendScores] = useState<ForecastSendScores>();
  const [screenWidth, setScreenWidth] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [pageLoaded, setPageLoaded] = useState<boolean>(false);
  const [error, setError] = useState('');

  const value = useMemo(
    () => ({
      currentGPSCoords,
      setCurrentGPSCoords,
      selectedLocCoords,
      setSelectedLocCoords,
      selectedLocType,
      setSelectedLocType,
      locationDetails,
      setLocationDetails,
      forecastData,
      setForecastData,
      hourlyForecastData,
      setHourlyForecastData,
      hourlyForecastParams,
      setHourlyForecastParams,
      forecastSendScores,
      setForecastSendScores,
      screenWidth,
      setScreenWidth,
      isLoading,
      setIsLoading,
      pageLoaded,
      setPageLoaded,
      error,
      setError,
    }),
    [
      currentGPSCoords,
      error,
      forecastData,
      forecastSendScores,
      hourlyForecastData,
      hourlyForecastParams,
      isLoading,
      locationDetails,
      pageLoaded,
      screenWidth,
      selectedLocCoords,
      selectedLocType,
    ],
  );

  return <HomeContext.Provider value={value}>{children}</HomeContext.Provider>;
};
