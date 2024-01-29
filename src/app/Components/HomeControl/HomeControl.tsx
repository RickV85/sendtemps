import TypeSelect from "../TypeSelect/TypeSelect";
import LocationSelect from "../LocationSelect/LocationSelect";
import { useState, useEffect, useContext } from "react";
import { ForecastData } from "@/app/Interfaces/interfaces";
import { HomeContext } from "@/app/Contexts/HomeContext";

interface Props {}

export default function HomeControl() {
  const { pageLoaded, setPageLoaded } = useContext(HomeContext);

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
