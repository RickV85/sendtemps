import { HomeContext } from "@/app/Contexts/HomeContext";
import { useContext, useEffect, useState, useRef } from "react";
import HourlyForecastTile from "../HourlyForecastTile/HourlyForecastTile";
import Image from "next/image";
import { filterHourlyForecastByTime } from "@/app/Util/utils";
import { fetchHourlyForecastWithRetry } from "@/app/Util/NoaaApiCalls";

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
    if (!hourlyForecastData && locationDetails) {
      setIsLoading(true);
      const hourlyForecastUrl = `${locationDetails.forecastUrl}/hourly`;

      fetchHourlyForecastWithRetry(hourlyForecastUrl)
        .then((res) => {
          setHourlyForecastData(res);
        })
        .then(() => setError(""))
        .catch((err) => {
          console.error(err);
          setError(`${err.message} Please reload the page and try again.`);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [
    hourlyForecastData,
    locationDetails,
    setError,
    setHourlyForecastData,
    setIsLoading,
  ]);

  useEffect(() => {
    if (hourlyForecastData?.properties.periods.length && hourlyForecastParams) {
      const startEndTime = {
        startTime: hourlyForecastParams.start,
        endTime: hourlyForecastParams.end,
      };

      const filteredPeriods = filterHourlyForecastByTime(
        hourlyForecastData.properties.periods,
        startEndTime
      );
      const display = filteredPeriods.map((period, i) => {
        const formattedTime = new Date(period.startTime).toLocaleTimeString(
          "en-us",
          {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          }
        );
        const periodForecastData = {
          time: formattedTime,
          temp: period.temperature,
          conditions: period.shortForecast,
          precip: period.probabilityOfPrecipitation.value,
          wind: { speed: period.windSpeed, direction: period.windDirection },
          humidity: period.relativeHumidity.value,
        };

        return (
          <HourlyForecastTile data={periodForecastData} key={`hourTile-${i}`} />
        );
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
