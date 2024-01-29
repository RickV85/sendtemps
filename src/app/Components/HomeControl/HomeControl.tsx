import TypeSelect from "../TypeSelect/TypeSelect";
import LocationSelect from "../LocationSelect/LocationSelect";
import { useState, useEffect } from "react";
import { ForecastData } from "@/app/Interfaces/interfaces";

interface Props {}

export default function HomeControl() {
  const [pageLoaded, setPageLoaded] = useState<boolean>(false);
  const [selectedLocType, setSelectedLocType] =
    useState<string>("Select Sport");
  const [selectedLocCoords, setSelectedLocCoords] = useState<
    string | undefined
  >();
  const [forecastData, setForecastData] = useState<ForecastData>();

  useEffect(() => {
    if (document.readyState === "complete") {
      setPageLoaded(true);
    } else {
      window.addEventListener("load", () => setPageLoaded(true));
    }

    return () => {
      window.removeEventListener("load", () => setPageLoaded(true));
    };
  }, []);

  
  return (
    <section className="home-control-section">
      <div className="home-forecast-select-div">
        {pageLoaded ? (
          <>
            <TypeSelect
              setSelectedLocType={setSelectedLocType}
              setForecastData={setForecastData}
            />
            <LocationSelect
              selectedLocType={selectedLocType}
              setSelectedLocCoords={setSelectedLocCoords}
              setForecastData={setForecastData}
              setError={setError}
            />
          </>
        ) : (
          <div className="home-loading-msg">
            <p>Please wait, loading...</p>
          </div>
        )}
      </div>
    </section>
  );
}
