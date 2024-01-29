import { createContext, useState } from "react";

interface HomeContextType {
  homePageLoaded: boolean;
  setHomePageLoaded: React.Dispatch<React.SetStateAction<boolean>>;
}

export const HomeContext = createContext<HomeContextType>({
  homePageLoaded: false,
  setHomePageLoaded: () => {},
});

interface HomeProviderProps {
  children: React.ReactNode;
}

export const HomeProvider: React.FC<HomeProviderProps> = ({ children }) => {
  const [homePageLoaded, setHomePageLoaded] = useState<boolean>(false);
  return (
    <HomeContext.Provider
      value={{
        homePageLoaded,
        setHomePageLoaded,
      }}
    >
      {children}
    </HomeContext.Provider>
  );
};
