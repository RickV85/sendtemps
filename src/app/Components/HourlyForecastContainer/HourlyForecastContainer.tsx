import { HomeContext } from "@/app/Contexts/HomeContext";
import { useContext, useEffect, useState } from "react";
import HourlyForecastTile from "../HourlyForecastTile/HourlyForecastTile";
import { HourlyForecastTimePeriod } from "@/app/Interfaces/interfaces";
import Image from "next/image";
import { filterHourlyForecastByTime } from "@/app/Util/utils";

interface Props {
  hourlyForecastTimePeriod: HourlyForecastTimePeriod;
  setHourlyForecastTimePeriod: React.Dispatch<
    React.SetStateAction<HourlyForecastTimePeriod | undefined>
  >;
}

export default function HourlyForecastContainer({
  hourlyForecastTimePeriod,
  setHourlyForecastTimePeriod,
}: Props) {
  const { hourlyForecastData } = useContext(HomeContext);
  const [hourlyForecastDisplay, setHourlyForecastDisplay] =
    useState<React.JSX.Element[]>();

  useEffect(() => {
    if (hourlyForecastData?.properties.periods.length) {
      const startEndTime = {
        startTime: hourlyForecastTimePeriod.start,
        endTime: hourlyForecastTimePeriod.end,
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
  }, [hourlyForecastData, hourlyForecastTimePeriod]);

  return (
    <section className="hourly-forecast-section">
      <header className="hourly-forecast-header">
        <button
          className="hourly-close-btn"
          onClick={() => {
            setHourlyForecastTimePeriod(undefined);
          }}
        >
          <Image
            src={"/icons8-close.svg"}
            alt="close hourly forecast display"
            fill={true}
            className="hourly-close-btn-icon"
          />
        </button>
        <h2>{hourlyForecastTimePeriod.name}</h2>
        {/* Spacer div, change if button width changes */}
        <div className="hourly-header-spacer"></div>
      </header>
      {hourlyForecastDisplay}
    </section>
  );
}
