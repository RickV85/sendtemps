"use client";

import "./home.css";
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
  const [selectedLocCoords, setSelectedLocCoords] = useState("");
  const [selectedLocType, setSelectedLocType] = useState("Current Location");
  const [locationDetails, setLocationDetails] = useState<LocationDetails>();
  const [forecastUrl, setForecastUrl] = useState("");
  const [forecastData, setForecastData] = useState<ForecastData>();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const locationFetchSuccess = (position: GeolocationPosition) => {
    setCurrentGPSCoords({
      latitude: `${position.coords.latitude}`,
      longitude: `${position.coords.longitude}`,
    });
  };

  const locationFetchFailure = () => {
    setError(
      "There was an error using your current location. Please allow this site to access your location or reload the page to try again."
    );
    setTimeout(() => {
      setError("");
    }, 3000);
  };

  useEffect(() => {
    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      locationFetchSuccess,
      locationFetchFailure
    );
  }, []);

  const getDefaultLocations = async () => {
    try {
      const response = await fetch("/api/default-locations");
      const result = await response.json();
      console.log(result);
      return result;
    } catch (error) {
      console.error("Get default locations request failed.");
    }
  };

  useEffect(() => {
    getDefaultLocations();
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
          setForecastUrl(result.properties.forecast);
          console.log(result);
        })
        .catch((err) => {
          console.error(err);
          setError(err);
        });
    }
  }, [selectedLocCoords]);

  useEffect(() => {
    if (forecastUrl) {
      console.log(forecastUrl);
      setIsLoading(true);

      fetchDailyForecastWithRetry(forecastUrl)
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
  }, [forecastUrl]);

  const createDetailedForecast = () => {
    const forecast = forecastData?.properties.periods.map((data, i) => {
      return <DetailedDayForecast data={data} key={i} />;
    });
    return forecast;
  };

  return (
    <main className="home-main">
      <div className="home-content">
        <h1>WeatherWise</h1>
        <p className="tagline">The best weather app of all time</p>
        {/* Conditional loading if error */}
        {error ? (
          <>
            <p className="error-msg">{`An error occurred while fetching your forecast. Please reload the page and try your request again. ${error}`}</p>
            <button
              className="reload-page-btn"
              onClick={() => window.location.reload()}
            >
              Reload page
            </button>
          </>
        ) : (
          <>
            <section className="header-section">
              <TypeSelect setSelectedLocType={setSelectedLocType} />
              <LocationSelect
                selectedLocType={selectedLocType}
                setSelectedLocCoords={setSelectedLocCoords}
              />
              {locationDetails ? (
                <h2 className="current-loc-display">{`Forecast for: ${locationDetails.properties.relativeLocation.geometry.coordinates[1].toFixed(
                  3
                )}, ${locationDetails.properties.relativeLocation.geometry.coordinates[0].toFixed(
                  3
                )}
                near ${
                  locationDetails.properties.relativeLocation.properties.city
                }, ${
                  locationDetails.properties.relativeLocation.properties.state
                }`}</h2>
              ) : (
                <p className="loading-msg">Fetching your location</p>
              )}
              {isLoading ? (
                <p className="loading-msg">Loading forecast</p>
              ) : null}
            </section>
            <section className="detailed-forecast">
              {createDetailedForecast()}
            </section>
          </>
        )}
      </div>
    </main>
  );
}
