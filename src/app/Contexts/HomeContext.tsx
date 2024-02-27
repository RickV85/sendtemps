"use client";
import React, { createContext, useState } from "react";
import {
  Coords,
  LocationDetails,
  ForecastData,
  HourlyForecastData,
  HourlyForecastParams,
} from "../Interfaces/interfaces";

interface HomeContextType {
  currentGPSCoords: Coords | undefined;
  setCurrentGPSCoords: React.Dispatch<React.SetStateAction<Coords | undefined>>;
  selectedLocCoords: string;
  setSelectedLocCoords: React.Dispatch<React.SetStateAction<string>>;
  selectedLocType: string;
  setSelectedLocType: React.Dispatch<React.SetStateAction<string>>;
  locationDetails: LocationDetails | undefined;
  setLocationDetails: React.Dispatch<
    React.SetStateAction<LocationDetails | undefined>
  >;
  forecastData: ForecastData | undefined;
  setForecastData: React.Dispatch<
    React.SetStateAction<ForecastData | undefined>
  >;
  hourlyForecastData: HourlyForecastData | undefined;
  setHourlyForecastData: React.Dispatch<
    React.SetStateAction<HourlyForecastData | undefined>
  >;
  hourlyForecastParams: HourlyForecastParams | undefined;
  setHourlyForecastParams: React.Dispatch<React.SetStateAction<HourlyForecastParams | undefined>>
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
  selectedLocCoords: "",
  setSelectedLocCoords: () => {},
  selectedLocType: "Select Sport",
  setSelectedLocType: () => {},
  locationDetails: undefined,
  setLocationDetails: () => {},
  forecastData: undefined,
  setForecastData: () => {},
  hourlyForecastData: undefined,
  setHourlyForecastData: () => {},
  hourlyForecastParams: undefined,
  setHourlyForecastParams: () => {},
  screenWidth: 0,
  setScreenWidth: () => {},
  isLoading: false,
  setIsLoading: () => {},
  pageLoaded: false,
  setPageLoaded: () => {},
  error: "",
  setError: () => {},
});

interface HomeProviderProps {
  children: React.ReactNode;
}

export const HomeProvider: React.FC<HomeProviderProps> = ({ children }) => {
  const [currentGPSCoords, setCurrentGPSCoords] = useState<Coords>();
  const [selectedLocCoords, setSelectedLocCoords] = useState<string>("");
  const [selectedLocType, setSelectedLocType] =
    useState<string>("Select Sport");
  const [locationDetails, setLocationDetails] = useState<LocationDetails>();
  const [forecastData, setForecastData] = useState<ForecastData>();
  const [hourlyForecastData, setHourlyForecastData] = useState<HourlyForecastData>();
  const [hourlyForecastParams, setHourlyForecastParams] = useState<HourlyForecastParams>();
  const [screenWidth, setScreenWidth] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [pageLoaded, setPageLoaded] = useState<boolean>(false);
  const [error, setError] = useState("");
  return (
    <HomeContext.Provider
      value={{
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
        screenWidth,
        setScreenWidth,
        isLoading,
        setIsLoading,
        pageLoaded,
        setPageLoaded,
        error,
        setError,
      }}
    >
      {children}
    </HomeContext.Provider>
  );
};
