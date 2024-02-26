import { HomeContext } from "@/app/Contexts/HomeContext";
import { useContext, useEffect, useState } from "react";
import HourlyForecastTile from "../HourlyForecastTile/HourlyForecastTile";
import { HourlyForecastParams } from "@/app/Interfaces/interfaces";
import Image from "next/image";
import { filterHourlyForecastByTime } from "@/app/Util/utils";

interface Props {
  hourlyForecastParams: HourlyForecastParams;
  setHourlyForecastParams: React.Dispatch<
    React.SetStateAction<HourlyForecastParams | undefined>
  >;
}

export default function HourlyForecastContainer({
  hourlyForecastParams,
  setHourlyForecastParams,
}: Props) {
  const { hourlyForecastData } = useContext(HomeContext);
  const [hourlyForecastDisplay, setHourlyForecastDisplay] =
    useState<React.JSX.Element[]>();

  useEffect(() => {
    if (hourlyForecastData?.properties.periods.length) {
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
    <section className="hourly-forecast-section">
      <header className="hourly-forecast-header">
        <button
          className="hourly-close-btn"
          onClick={() => {
            setHourlyForecastParams(undefined);
          }}
        >
          <Image
            src={"/icons8-close.svg"}
            alt="close hourly forecast display"
            fill={true}
            className="hourly-close-btn-icon"
          />
        </button>
        <h2>{hourlyForecastParams.name}</h2>
        {/* Spacer div, change if button width changes */}
        <div className="hourly-header-spacer"></div>
      </header>
      <div className="hourly-forecast-container">
        {hourlyForecastDisplay}
      </div>
    </section>
  );
}
