import styles from "./MapPin.module.css";
import Image from "next/image";

interface Props {
  title: string
}

export default function MapPin({title} : Props) {
  return (
    <div className={styles.container}>
      <p className={styles.title}>{title}</p>
      <Image
        src={"/icons8-location-50.png"}
        height={30}
        width={30}
        alt="map marker pin"
        className={styles["map-pin-png"]}
      />
    </div>
  );
}
