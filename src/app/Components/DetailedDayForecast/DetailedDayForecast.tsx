import { useContext } from "react";
import { HomeContext } from "@/app/Contexts/HomeContext";

interface Props {
  data: {
    name: string;
    detailedForecast: string;
    relativeHumidity: {
      value: number;
    };
    icon: string;
    startTime: string;
    endTime: string;
  };
}

const DetailedDayForecast: React.FC<Props> = ({ data }) => {
  const { setHourlyForecastParams } = useContext(HomeContext);
  if (data) {
    return (
      <article
        className="detailed-day-forecast"
        onClick={() => {
          setHourlyForecastParams({
            name: data.name,
            start: data.startTime,
            end: data.endTime,
          });
        }}
      >
        <div className="day-forecast-header">
          {/* Using img here, had issues with loading using Image component */}
          {/* eslint-disable-next-line */}
          <img
            src={data.icon}
            height={60}
            width={60}
            alt="weather icon"
            loading="lazy"
            className="day-forecast-icon"
          />
          <h2 className="day-header-text">{data.name}</h2>
          <div className="day-header-details">
            {data.relativeHumidity ? (
              <p>{data.relativeHumidity.value}% RH</p>
            ) : null}
          </div>
        </div>
        <p className="day-forecast-text">{data.detailedForecast}</p>
      </article>
    );
  }
};

export default DetailedDayForecast;
