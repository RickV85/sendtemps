"use client";

import "./home.css";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  fetchDailyForecastWithRetry,
  fetchNoaaGridLocationWithRetry,
} from "./Util/APICalls";
import { Coords, ForecastData, LocationDetails } from "./Interfaces/interfaces";
import LocationSelect from "./Components/LocationSelect/LocationSelect";
import DetailedDayForecast from "./Components/DetailedDayForecast/DetailedDayForecast";
import TypeSelect from "./Components/TypeSelect/TypeSelect";

export default function Home() {
  const [currentGPSCoords, setCurrentGPSCoords] = useState<Coords>();
  const [selectedLocCoords, setSelectedLocCoords] = useState<
    string | undefined
  >();
  const [selectedLocType, setSelectedLocType] =
    useState<string>("Current Location");
  const [locationDetails, setLocationDetails] = useState<LocationDetails>();
  const [forecastData, setForecastData] = useState<ForecastData>();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const locationFetchSuccess = (position: GeolocationPosition) => {
    setCurrentGPSCoords({
      latitude: `${position.coords.latitude}`,
      longitude: `${position.coords.longitude}`,
    });
    setSelectedLocCoords(
      `${position.coords.latitude},${position.coords.longitude}`
    );
  };

  const locationFetchFailure = () => {
    alert(
      "Please consider allowing this app to use your location for an immediate display of your current location's forecast."
    );
  };

  useEffect(() => {
    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      locationFetchSuccess,
      locationFetchFailure
    );
  }, []);

  useEffect(() => {
    if (selectedLocType === "Current Location" && currentGPSCoords) {
      setSelectedLocCoords(
        `${currentGPSCoords.latitude},${currentGPSCoords.longitude}`
      );
    }
  }, [selectedLocType, currentGPSCoords]);

  useEffect(() => {
    if (selectedLocCoords) {
      fetchNoaaGridLocationWithRetry(selectedLocCoords)
        .then((result) => {
          setLocationDetails(result);
        })
        .catch((err) => {
          console.error(err);
          setError(err);
        });
    }
  }, [selectedLocCoords]);

  useEffect(() => {
    if (locationDetails?.properties.forecast) {
      setIsLoading(true);

      fetchDailyForecastWithRetry(locationDetails.properties.forecast)
        .then((result) => {
          setForecastData(result);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error(err.message);
          setError(err.message);
          setIsLoading(false);
        });
    }
  }, [locationDetails]);

  const createDetailedForecast = () => {
    const forecast = forecastData?.properties.periods.map((data, i) => {
      return <DetailedDayForecast data={data} key={`forecastPeriod-${i}`} />;
    });
    return forecast;
  };

  return (
    <main className="home-main">
      <header className="home-header">
        <div className="hero-img-div">
          <h1 className="site-title">SendTemps</h1>
          <Image
            src={"/images/sendtemps_header.webp"}
            alt="Boulder Flatirons background with rock climber silhouette in foreground"
            fill={true}
            priority={true}
            className="header-bkgd-img"
          />
        </div>
      </header>
      <section className="home-forecast-section">
        <section className="type-location-select-section">
          <TypeSelect
            setSelectedLocType={setSelectedLocType}
            currentGPSCoords={currentGPSCoords}
          />
          <LocationSelect
            selectedLocType={selectedLocType}
            setSelectedLocCoords={setSelectedLocCoords}
          />
        </section>
        {/* Error ? load: */}
        {error ? (
          <>
            <p className="error-msg">{`An error occurred while fetching your forecast. 
            Please reload the page and try your request again. ${error}`}</p>
            <button
              className="reload-page-btn"
              onClick={() => window.location.reload()}
            >
              Reload page
            </button>
          </>
        ) : (
          <>
            {/* No error ? load: */}
            {isLoading ? <p className="loading-msg">Loading forecast</p> : null}
            <section className="detailed-forecast">
              {createDetailedForecast()}
            </section>
          </>
        )}
      </section>
    </main>
  );
}
