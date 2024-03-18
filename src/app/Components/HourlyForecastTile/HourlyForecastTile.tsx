import styles from "./HourlyForecast.module.css";

interface Props {
  data: {
    time: string;
    temp: number | null;
    conditions: string;
    precip: number | null;
    wind: { speed: string; direction: string };
    humidity: number | null;
  };
}

export default function HourlyForecastTile({ data }: Props) {
  return (
    <article className={styles.article}>
      <div className={`${styles["time-div"]} ${styles["detail-div"]}`}>
        <h3>{data.time}</h3>
      </div>
      <div className={`${styles["temp-div"]} ${styles["detail-div"]}`}>
        <p>{data.temp} °F</p>
        <p>{data.conditions}</p>
      </div>
      <div className={styles["detail-div"]}>
        <p>{data.precip || "0"}%</p>
        <p>Precip.</p>
      </div>
      <div className={styles["detail-div"]}>
        <p>{data.wind.speed}</p>
        <p>{data.wind.direction}</p>
      </div>
      <div className={styles["detail-div"]}>
        <p>{data.humidity}%</p>
        <p>RH</p>
      </div>
    </article>
  );
}
