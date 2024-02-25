import styles from "./HourlyForecast.module.css";

interface Props {
  data: {
    time: string;
    conditions: string;
    precip: string;
    wind: string;
    humidity: string;
  }
}

export default function HourlyForecastTile({ data }: Props) {
  return (
    <article className={styles.article}>
        <h3>{data.time}</h3>
        <p>{data.conditions}</p>
        <p>{data.precip}</p>
        <p>{data.wind}</p>
        <p>{data.humidity}</p>
    </article>
  )
}