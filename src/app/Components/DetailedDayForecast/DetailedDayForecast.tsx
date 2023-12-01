
interface Props {
  data: {
    name: string;
    detailedForecast: string;
  };
}

const DetailedDayForecast: React.FC<Props> = ({ data }) => {
  return (
    <article className="detailed-day-forecast">
      <h3>{data.name}</h3>
      <p>{data.detailedForecast}</p>
    </article>
  );
};

export default DetailedDayForecast;
