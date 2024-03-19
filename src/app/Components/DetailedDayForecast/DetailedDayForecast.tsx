import { useContext } from "react";
import { HomeContext } from "@/app/Contexts/HomeContext";
import { ForecastPeriod } from "@/app/Classes/ForecastPeriod";

interface Props {
  period: ForecastPeriod;
}

const DetailedDayForecast: React.FC<Props> = ({ period }) => {
  const { setHourlyForecastParams, hourlyForecastData } =
    useContext(HomeContext);
  if (period && hourlyForecastData) {
    const hourlyParams = {
      name: period.name,
      start: period.startTime,
      end: period.endTime,
    };
    const maxMinRH =
      hourlyForecastData.getMinMaxHumidityForTimePeriod(hourlyParams);
    return (
      <article
        className="detailed-day-forecast"
        onClick={() => {
          setHourlyForecastParams(hourlyParams);
        }}
      >
        <div className="day-forecast-header">
          {/* Using img here, had issues with loading using Image component */}
          {/* eslint-disable-next-line */}
          <img
            src={period.icon}
            height={60}
            width={60}
            alt="weather icon"
            loading="lazy"
            className="day-forecast-icon"
          />
          <h2 className="day-header-text">{period.name}</h2>
          <div className="day-header-details">
            {period.relativeHumidity ? (
              <p>{period.relativeHumidity.value}% RH</p>
            ) : null}
          </div>
        </div>
        <p className="day-forecast-text">{period.detailedForecast}</p>
      </article>
    );
  }
};

export default DetailedDayForecast;
