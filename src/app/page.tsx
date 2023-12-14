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
    useState<string>("Select Sport");
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

  const welcomeMessage = (
    <div className="home-welcome-msg-div">
      <h2 className="home-welcome-header">Welcome to SendTemps!</h2>
      <p>
        Choose from Climbing, Mountain Biking, or Skiing/Snowboarding above to
        get highly-accurate, NOAA pinpoint forecasts for any of my favorite
        destinations for the selected sport all around Colorado&apos;s Front
        Range.
        <br />
        <br />
        In my experience over the last decade, NOAA&apos;s pinpoint forecasts
        have proven to be far more accurate for backcountry destinations when
        compared to the average weather app. So I decided to build this
        straight-forward, ad-free app for my fellow Front-Rangers to easily get
        an accurate forecast for their own backcountry adventures!
        <br />
        <br />
        New features are coming soon! Next up, I am building an &quot;Add your
        own location&quot; feature so you can save your favorite locations and
        hourly forecasts for a selected day. If you have feedback or feature
        suggestions, please email to rickv85@gmail.com to give me!
      </p>
    </div>
  );

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
        </div>
      </header>
      <section className="home-main-display">
        <section className="type-location-section">
          <TypeSelect
            setSelectedLocType={setSelectedLocType}
            currentGPSCoords={currentGPSCoords}
            setForecastData={setForecastData}
          />
          <LocationSelect
            selectedLocType={selectedLocType}
            setSelectedLocCoords={setSelectedLocCoords}
            setForecastData={setForecastData}
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
