import { useContext } from 'react';
import { HomeContext } from '@/app/Contexts/HomeContext';
import { ForecastPeriod } from '@/app/Classes/ForecastPeriod';

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

    const sendScoreData = forecastSendScores?.forecastPeriods.find(
      (score) => score.name === period.name
    );

    console.log(period);

    return (
      <article
        className="detailed-day-forecast"
        onClick={() => {
          setHourlyForecastParams(hourlyParams);
        }}
        title={`Click for ${period.name}'s hourly forecast`}
      >
        <div className="day-forecast-header">
          <div className="day-forecast-header layer1">
            <div className="day-forecast-icon-div">
              {/* Using img here, had issues with loading using Image component */}
              {/* eslint-disable-next-line */}
              <img
                src={`https://api.weather.gov${period.icon}`}
                height={60}
                width={60}
                alt="weather icon"
                loading="lazy"
                className="day-forecast-icon"
              />
            </div>
            <div className="day-forecast-header layer2">
              <h2 className="day-header-text">{period.name}</h2>
            </div>
            <div className="day-send-score-div">
              {sendScoreData?.sendScore && (
                <>
                  <p>SendScore:</p>
                  <p id="sendScore">{sendScoreData.sendScore}</p>
                </>
              )}
            </div>
          </div>
        </div>
        <p className="day-forecast-text">{`${
          period.detailedForecast
        } Humidity ${minRH.toLocaleString()}% to ${
          // RH now undefined on period, not on hourly though
          // need to create a maxRH from hourly values
          period.relativeHumidity?.value
        }% RH.`}</p>
      </article>
    );
  }
};

export default DetailedDayForecast;
