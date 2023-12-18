"use client";

import "./home.css";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useContext } from "react";
import {
  fetchDailyForecastWithRetry,
  fetchNoaaGridLocationWithRetry,
} from "./Util/APICalls";
import {
  Coords,
  ForecastData,
  LocationDetails,
} from "./Interfaces/interfaces";
import LocationSelect from "./Components/LocationSelect/LocationSelect";
import DetailedDayForecast from "./Components/DetailedDayForecast/DetailedDayForecast";
import TypeSelect from "./Components/TypeSelect/TypeSelect";
import { SessionProvider } from "next-auth/react";
import Session from "./Components/Session/Session";
import { welcomeMessage } from "./home-welcome-msg";
import { UserContext } from '../app/Contexts/UserContext';

export default function Home() {
  const [currentGPSCoords, setCurrentGPSCoords] = useState<Coords>();
  const [selectedLocCoords, setSelectedLocCoords] = useState<
    string | undefined
  >();
  const [selectedLocType, setSelectedLocType] =
    useState<string>("Select Sport");
  const [locationDetails, setLocationDetails] = useState<LocationDetails>();
  const [forecastData, setForecastData] = useState<ForecastData>();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { userInfo, setUserInfo } = useContext(UserContext);

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
    setIsLoading(false);
    alert(
      "Please allow this app to use your location if you would like a display of your current location's forecast."
    );
  };

  useEffect(() => {
    if (selectedLocType === "Current Location") {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        locationFetchSuccess,
        locationFetchFailure
      );
    }
  }, [selectedLocType]);

  useEffect(() => {
    if (selectedLocType === "Current Location" && currentGPSCoords) {
      setSelectedLocCoords(
        `${currentGPSCoords.latitude},${currentGPSCoords.longitude}`
      );
    }
  }, [selectedLocType, currentGPSCoords]);

  useEffect(() => {
    if (selectedLocCoords) {
      setIsLoading(true);
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
            src={"/images/sendtemps_header_2.webp"}
            alt="Boulder Flatirons background with rock climber silhouette in foreground"
            fill={true}
            priority={true}
            quality={100}
            sizes="100vw"
            className="header-bkgd-img"
          />
          <SessionProvider>
            <Session />
          </SessionProvider>
        </div>
      </header>
      <section className="home-main-section">
        <section className="home-control-section">
          <TypeSelect
            setSelectedLocType={setSelectedLocType}
            setForecastData={setForecastData}
          />
          <LocationSelect
            selectedLocType={selectedLocType}
            setSelectedLocCoords={setSelectedLocCoords}
            setForecastData={setForecastData}
            userInfo={userInfo}
            setError={setError}
          />
          {userInfo ? (
            <Link href={"/add-location"}>
              <button className="add-location-btn">Create New Location</button>
            </Link>
          ) : null}
        </section>
        {/* Error ? load: */}
        {error ? (
          <>
            <p className="error-msg">{`Oh, no! ${error} Please reload the page and try your request again.`}</p>
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
            <section className="forecast-section">
              {isLoading ? (
                <p className="loading-msg">Loading forecast...</p>
              ) : null}
              {selectedLocType === "Select Sport" ? welcomeMessage : null}
              {createDetailedForecast()}
            </section>
          </>
        )}
      </section>
    </main>
  );
}
