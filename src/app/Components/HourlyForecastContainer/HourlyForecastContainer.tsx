import { HomeContext } from "@/app/Contexts/HomeContext";
import { useContext, useEffect, useState } from "react";
import HourlyForecastTile from "../HourlyForecastTile/HourlyForecastTile";
import { HourlyForecastTimePeriod } from "@/app/Interfaces/interfaces";

interface Props {
  hourlyForecastTimePeriod: HourlyForecastTimePeriod;
}

export default function HourlyForecastContainer({
  hourlyForecastTimePeriod,
}: Props) {
  const { hourlyForecastData } = useContext(HomeContext);
  const [hourlyForecastDisplay, setHourlyForecastDisplay] =
    useState<React.JSX.Element[]>();

  useEffect(() => {
    if (hourlyForecastData?.properties.periods.length) {
      const display = hourlyForecastData.properties.periods.map((period, i) => {
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
  }, [hourlyForecastData]);

  return (
    <section className="hourly-forecast-section">
      {hourlyForecastDisplay}
    </section>
  );
}
