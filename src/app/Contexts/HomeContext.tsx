import { createContext, useState } from "react";
import {
  Coords,
  LocationDetails,
  ForecastData,
} from "../Interfaces/interfaces";

interface HomeContextType {
  currentGPSCoords: Coords | undefined;
  setCurrentGPSCoords: React.Dispatch<React.SetStateAction<Coords | undefined>>;
  selectedLocCoords: string | undefined;
  setSelectedLocCoords: React.Dispatch<
    React.SetStateAction<string | undefined>
  >;
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
  initialScreenWidth: number | undefined;
  setInitialScreenWidth: React.Dispatch<
    React.SetStateAction<number | undefined>
  >;
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
  selectedLocCoords: undefined,
  setSelectedLocCoords: () => {},
  selectedLocType: "Select Sport",
  setSelectedLocType: () => {},
  locationDetails: undefined,
  setLocationDetails: () => {},
  forecastData: undefined,
  setForecastData: () => {},
  initialScreenWidth: undefined,
  setInitialScreenWidth: () => {},
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
  const [selectedLocCoords, setSelectedLocCoords] = useState<string>();
  const [selectedLocType, setSelectedLocType] =
    useState<string>("Select Sport");
  const [locationDetails, setLocationDetails] = useState<LocationDetails>();
  const [forecastData, setForecastData] = useState<ForecastData>();
  const [initialScreenWidth, setInitialScreenWidth] = useState<number>();
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
        initialScreenWidth,
        setInitialScreenWidth,
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
