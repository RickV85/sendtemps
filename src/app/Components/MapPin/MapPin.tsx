import styles from "./MapPin.module.css";
import Image from "next/image";

interface Props {
  title: string;
  poiType: string;
}

export default function MapPin({title, poiType} : Props) {
  const iconType = () => {
    switch (poiType) {
      case "climb" : return "/climbing-pin.png";
      case "mtb" : return "/mtb-pin.png";
      case "ski" : return "/snowflake-pin.png";
      default : return "/orange-pin.png";
    }
  }
  // <a target="_blank" href="https://icons8.com/icon/10018/winter">Snowflake</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a>
  // <a target="_blank" href="https://icons8.com/icon/9780/climbing">Climbing</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a>
  // <a target="_blank" href="https://icons8.com/icon/9823/mountain-biking">Mountain Biking</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a>
  return (
    <div className={styles.container}>
      <h4 className={styles.title}>{title}</h4>
      <Image
        src={iconType()}
        fill={true}
        sizes="5vw"
        priority={false}
        alt="map marker pin"
        className={styles["map-pin-png"]}
      />
    </div>
  );
}
