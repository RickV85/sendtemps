import { HomeContext } from "@/app/Contexts/HomeContext";
import { useContext, useEffect, useState, useRef } from "react";
import HourlyForecastTile from "../HourlyForecastTile/HourlyForecastTile";
import Image from "next/image";
import { fetchHourlyForecastWithRetry } from "@/app/Util/NoaaApiCalls";
import { HourlyForecast } from "@/app/Classes/HourlyForecast";

export default function HourlyForecastContainer() {
  const {
    locationDetails,
    hourlyForecastData,
    setHourlyForecastData,
    hourlyForecastParams,
    setHourlyForecastParams,
    setIsLoading,
    setError,
    screenWidth,
  } = useContext(HomeContext);
  const [hourlyForecastDisplay, setHourlyForecastDisplay] =
    useState<React.JSX.Element[]>();
  const hourlyForecastSection = useRef<null | HTMLElement>(null);

  // Scroll to top of the hourly forecast section once rendered
  useEffect(() => {
    if (hourlyForecastDisplay && screenWidth > 768) {
      hourlyForecastSection.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else if (hourlyForecastDisplay && screenWidth < 768) {
      const homeHeaderDims = document
        .querySelector(".home-header")
        ?.getBoundingClientRect();
      if (homeHeaderDims?.height) {
        const scrollPos = homeHeaderDims.height;
        window.scrollTo({
          top: scrollPos,
          left: 0,
          behavior: "smooth",
        });
      }
    }
  }, [hourlyForecastDisplay, screenWidth]);

  useEffect(() => {
    if (hourlyForecastData && hourlyForecastParams) {
      const filteredPeriods =
        hourlyForecastData.filterHourlyPeriodsByTime(hourlyForecastParams);
      const display = filteredPeriods.map((period, i) => {
        return <HourlyForecastTile data={period} key={`hourTile-${i}`} />;
      });
      setHourlyForecastDisplay(display);
    }
  }, [hourlyForecastData, hourlyForecastParams]);

  return (
    <section className="hourly-forecast-section" ref={hourlyForecastSection}>
      {/* Display div to prevent layout shift until forecast
      display is loaded and rendered */}
      {hourlyForecastDisplay ? (
        <>
          <header className="hourly-forecast-header">
            <button
              className="hourly-close-btn"
              onClick={() => {
                setHourlyForecastParams(undefined);
              }}
            >
              {screenWidth < 769 ? (
                <Image
                  src={"/icons8-close.svg"}
                  alt="close hourly forecast display"
                  fill={true}
                  className="hourly-close-btn-icon"
                />
              ) : (
                <p>Back</p>
              )}
            </button>
            <h2>{hourlyForecastParams?.name}</h2>
            {/* Spacer div, change if button width changes */}
            <div className="hourly-header-spacer"></div>
          </header>
          <div className="hourly-forecast-container">
            {hourlyForecastDisplay}
          </div>
        </>
      ) : (
        <div className="forecast-section loading"></div>
      )}
    </section>
  );
}
