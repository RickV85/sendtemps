import styles from "./MapPin.module.css";
import Image from "next/image";

interface Props {
  title: string
}

export default function MapPin({title} : Props) {
  return (
    <div className={styles.container}>
      <h4 className={styles.title}>{title}</h4>
      <Image
        src={"/orange-pin.png"}
        fill={true}
        sizes="5vw"
        priority={false}
        alt="map marker pin"
        className={styles["map-pin-png"]}
      />
    </div>
  );
}
