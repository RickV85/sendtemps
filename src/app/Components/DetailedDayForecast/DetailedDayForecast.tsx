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
        <h3>{data.name}</h3>
      <div className="day-forecast-header">
        <Image
          src={data.icon}
          height={60}
          width={60}
          alt="weather icon"
          className="day-forecast-icon"
        />
      <p className="day-forecast-text">
        {data.detailedForecast} Relative humidity: {data.relativeHumidity.value}
        %
      </p>
      </div>
    </article>
  );
};

export default DetailedDayForecast;
