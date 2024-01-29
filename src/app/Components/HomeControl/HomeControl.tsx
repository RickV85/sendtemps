import TypeSelect from "../TypeSelect/TypeSelect";
import LocationSelect from "../LocationSelect/LocationSelect";
import { useContext } from "react";
import { HomeContext } from "@/app/Contexts/HomeContext";

export default function HomeControl() {
  const {
    setSelectedLocCoords,
    selectedLocType,
    setSelectedLocType,
    setForecastData,
    pageLoaded,
    setError,
  } = useContext(HomeContext);

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
