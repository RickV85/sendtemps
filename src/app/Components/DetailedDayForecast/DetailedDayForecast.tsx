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
        <Image
          src={data.icon}
          height={50}
          width={50}
          alt="weather icon"
          className="day-forecast-icon"
        />
        <h3>{data.name}</h3>
        <div className="humidity-div">
          <p>RH:{" "}
          {data.relativeHumidity.value}%</p>
        </div>
      </div>
        <p className="day-forecast-text">
          {data.detailedForecast}
        </p>
    </article>
  );
};

export default DetailedDayForecast;
