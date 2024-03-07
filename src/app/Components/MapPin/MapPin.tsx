import styles from "./MapPin.module.css";
import Image from "next/image";

interface Props {
  title: string;
  poiType: string;
}

export default function MapPin({ title, poiType }: Props) {
  const iconType = () => {
    switch (poiType) {
      case "climb":
        return "/climbing-pin.png";
      case "mtb":
        return "/mtb-pin.png";
      case "ski":
        return "/snowflake-pin.png";
      default:
        return "/default-pin.png";
    }
  };
  const iconCredit = () => {
    let link = "https://icons8.com/icon/7880/location";
    let iconName = "Location";

    if (poiType === "climb") {
      link = "https://icons8.com/icon/9780/climbing";
      iconName = "Climbing";
    } else if (poiType === "mtb") {
      link = "https://icons8.com/icon/9823/mountain-biking";
      iconName = "Mountain Biking";
    } else if (poiType === "ski") {
      link = "https://icons8.com/icon/10018/winter";
      iconName = "Snowflake";
    }

    return (
      <span style={{ display: "none" }}>
        <a target="_blank" href={link}>
          {iconName}
        </a>{" "}
        icon by{" "}
        <a target="_blank" href="https://icons8.com">
          Icons8
        </a>
      </span>
    );
  };

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
      {iconCredit()}
    </div>
  );
}
