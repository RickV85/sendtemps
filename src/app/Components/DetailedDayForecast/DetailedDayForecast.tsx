import Image from "next/image";
interface Props {
  data: {
    name: string;
    detailedForecast: string;
    relativeHumidity: {
      value: number;
    };
    icon: string;
  };
}

const DetailedDayForecast: React.FC<Props> = ({ data }) => {
  return (
    <article className="detailed-day-forecast">
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
        <div className="humidity-div">
          <p>{data.relativeHumidity.value}%</p>
          <Image 
            src={"/icons/icons8-humidity-48.png"}
            alt="Humidity icon"
            height={48}
            width={48}
            className="humidity-icon"
          />
        </div>
      </div>
        <p className="day-forecast-text">
          {data.detailedForecast}
        </p>
    </article>
  );
};

export default DetailedDayForecast;
