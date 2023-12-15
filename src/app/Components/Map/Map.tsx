"use client";

import { Loader } from "@googlemaps/js-api-loader";
import { useRef, useEffect, Dispatch } from "react";
import { GoogleMapPoint } from "@/app/Interfaces/interfaces";

interface Props {
  mapLocations: Array<GoogleMapPoint>,
  setNewUserLocCoords: Dispatch<React.SetStateAction<{lat: number, lng: number} | undefined>>,
}

export default function Map({ mapLocations, setNewUserLocCoords }: Props) {
  const mapRef = useRef(null);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!;

  useEffect(() => {
    const loader = new Loader({
      apiKey: apiKey,
      version: "weekly",
      libraries: ["drawing"],
    });

    let map: google.maps.Map | null = null;

    loader.importLibrary("maps").then(() => {
      if (mapRef.current !== null) {
        map = new google.maps.Map(mapRef.current, {
          center: { lat: 40, lng: -105.5 },
          zoom: 10,
        });
      }

      mapLocations.forEach((location: GoogleMapPoint) => {
        if (map !== null) {
          new google.maps.Marker({
            position: location.coords,
            map: map,
            label: {
              text: location.name,
              fontFamily: "Tahoma",
              fontSize: "12px",
              fontWeight: "500",
            },
            clickable: false,
          });
        }
      });

      const drawingManager = new google.maps.drawing.DrawingManager({
        drawingMode: google.maps.drawing.OverlayType.MARKER,
        drawingControl: true,
        drawingControlOptions: {
          position: google.maps.ControlPosition.BOTTOM_CENTER,
          drawingModes: [google.maps.drawing.OverlayType.MARKER],
        },
        markerOptions: {
          // Define this to use a specific image
          icon: undefined,
          label: {
            text: "Your new location!",
            fontFamily: "Tahoma",
            fontSize: "12px",
            fontWeight: "500",
          },
        },
      });

      drawingManager.setMap(map);

      google.maps.event.addListener(
        drawingManager,
        "overlaycomplete",
        function (event) {
          if (event.type === google.maps.drawing.OverlayType.MARKER) {
            const markerPosition = event.overlay.getPosition();

            const newUserMapPoint: {lat: number, lng: number} = {
              lat: markerPosition.lat().toFixed(6),
              lng: markerPosition.lng().toFixed(6),
            };

            setNewUserLocCoords(() => {
              if (newUserMapPoint) {
                drawingManager.setOptions({
                  drawingMode: null,
                  drawingControl: false,
                });
              }
              return newUserMapPoint;
            });
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            });
          }
        }
      );
    });

    return () => {
      if (map) {
        map = null;
      }
    };
    //eslint-disable-next-line
  }, []);

  return <div ref={mapRef} style={{ height: "100%", width: "100%" }} />;
}
