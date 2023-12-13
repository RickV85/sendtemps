import Image from "next/image";

interface Props {
  markerType: string,
  text: string,
  lat: number,
  lng: number
}

export default function MapMarker({ markerType, text, lat, lng }: Props) {
  switch (markerType) {
    case "climb":
      return (
        <div style={{ height: "70px", width: "70px" }}>
          {/* <p>{text}</p> */}
          <div style={{ height: "20px", width: "20px", position: "relative" }}>
          <Image
            src="https://img.icons8.com/ios-filled/50/2A3C43/climbing.png"
            alt="climbing location icon"
            fill
          />

          </div>
        </div>
      );
  }
}
