"use client";

import { Loader } from "@googlemaps/js-api-loader";
import MapMarker from "../MapMarker/MapMarker";
import { useRef, useEffect, useState } from "react";
import { UserMapPoint } from "@/app/Interfaces/interfaces";

export default function Map() {
  const mapRef = useRef(null);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!;
  const [userMapPoints, setUserMapPoints] = useState<Array<UserMapPoint>>([]);

  const maxMarkers = 5;

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
          center: { lat: 40, lng: -105.4 },
          zoom: 8,
        });
      }

      const drawingManager = new google.maps.drawing.DrawingManager({
        drawingMode: google.maps.drawing.OverlayType.MARKER,
        drawingControl: true,
        drawingControlOptions: {
          position: google.maps.ControlPosition.TOP_CENTER,
          drawingModes: [google.maps.drawing.OverlayType.MARKER],
        },
        markerOptions: {
          // Define this to use a specific image
          icon: undefined,
        },
      });

      drawingManager.setMap(map);

      google.maps.event.addListener(
        drawingManager,
        "overlaycomplete",
        function (event) {
          if (event.type === google.maps.drawing.OverlayType.MARKER) {
            const markerPosition = event.overlay.getPosition();

            const newUserMapPoint: UserMapPoint = {
              lat: markerPosition.lat().toFixed(6),
              lng: markerPosition.lng().toFixed(6),
            };
            console.log(newUserMapPoint);

            setUserMapPoints((prevPoints) => {
              const updatedPoints = [...prevPoints, newUserMapPoint];

              if (updatedPoints.length >= maxMarkers) {
                drawingManager.setOptions({
                  drawingMode: null,
                  drawingControl: false,
                });
              }
              return updatedPoints;
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
  }, []);

  return <div ref={mapRef} style={{ height: "100%", width: "100%" }} />;
}
