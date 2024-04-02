import { useContext } from "react";
import { HomeContext } from "@/app/Contexts/HomeContext";
import { ForecastPeriod } from "@/app/Classes/ForecastPeriod";

interface Props {
  period: ForecastPeriod;
}

const DetailedDayForecast: React.FC<Props> = ({ period }) => {
  const { setHourlyForecastParams, hourlyForecastData, forecastSendScores } =
    useContext(HomeContext);
  if (period && hourlyForecastData) {
    const hourlyParams = {
      name: period.name,
      start: period.startTime,
      end: period.endTime,
    };
    const minRH = hourlyForecastData.getMinRHForTimePeriod(hourlyParams);
    const sendScore = forecastSendScores?.forecastPeriods.find(
      (score) => score.name === period.name
    );
    return (
      <article
        className="detailed-day-forecast"
        onClick={() => {
          setHourlyForecastParams(hourlyParams);
        }}
        title={`Click for ${period.name}'s hourly forecast`}
      >
        <div className="day-forecast-header">
          {/* Using img here, had issues with loading using Image component */}
          <div className="day-forecast-icon-div">
            {/* eslint-disable-next-line */}
            <img
              src={period.icon}
              height={60}
              width={60}
              alt="weather icon"
              loading="lazy"
              className="day-forecast-icon"
            />
          </div>
          <h2 className="day-header-text">{period.name}</h2>
          <div className="day-header-details">
            {period.relativeHumidity ? (
              <>
                <p>SendScore {sendScore?.sendScore}</p>
              </>
            ) : null}
          </div>
        </div>
        <p className="day-forecast-text">{`${
          period.detailedForecast
        } Humidity ${minRH.toLocaleString()}% to ${
          period.relativeHumidity.value
        }% RH.`}</p>
      </article>
    );
  }
};

export default DetailedDayForecast;
