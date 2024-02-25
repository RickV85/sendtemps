import { HomeContext } from "@/app/Contexts/HomeContext";
import { useContext, useEffect, useState } from "react";
import HourlyForecastTile from "../HourlyForecastTile/HourlyForecastTile";

export default function HourlyForecastContainer() {
  const { hourlyForecastData } = useContext(HomeContext);
  const [hourlyForecastDisplay, setHourlyForecastDisplay] =
    useState<React.JSX.Element[]>();

  useEffect(() => {
    if (hourlyForecastData?.properties.periods.length) {
      const display = hourlyForecastData.properties.periods.map((period, i) => {
        const time = new Date(period.startTime).toLocaleTimeString("en-us", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        });
        const conditions = `${period.temperature} ${period.shortForecast}`;
        const precip = `${period.probabilityOfPrecipitation.value}% Precip.`;
        const wind = `${period.windSpeed} ${period.windDirection}`;
        const humidity = `${period.relativeHumidity.value}% RH`;

        return (
          <HourlyForecastTile
            data={{ time, conditions, precip, wind, humidity }}
            key={`hourTile-${i}`}
          />
        );
      });
      setHourlyForecastDisplay(display);
    }
  }, [hourlyForecastData]);

  return <section className="hourly-forecast-section">{hourlyForecastDisplay}</section>;
}
