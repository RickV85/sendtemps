"use client";

import { Loader } from "@googlemaps/js-api-loader";
import MapMarker from "../MapMarker/MapMarker";
import { useRef, useEffect, useState } from "react";
import { UserMapPoint } from "@/app/Interfaces/interfaces";
import { Fugaz_One } from "next/font/google";

export default function Map() {
  const mapRef = useRef(null);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!;
  const [userCustomLocation, setUserCustomLocation] = useState<UserMapPoint>();

  const maxMarkers = 1;

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
          zoom: 10,
        });
      }

      const fetchPredefinedLocations = async () => {
        const locations = await fetch("/api/default_locations");
        return locations;
      };

      fetchPredefinedLocations()
        .then((response) => {
          if (response.ok) {
            const locations = response.json();
            return locations;
          } else {
            throw new Error("Default locations did not load from API");
          }
        })
        .then((result) => {
          if (result) {
            const defaultMarkers = result.map((location: any) => {
              if (map !== null) {
                const coords = {lat: +location.latitude, lng: +location.longitude};
                const point = new google.maps.Marker({
                  position: coords,
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
            return defaultMarkers;
          }
        });

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
          label: {
            text: "Your new location!",
            fontFamily: "Tahoma",
            fontSize: "12px",
            fontWeight: "500",
          }
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

            setUserCustomLocation(() => {
              if (newUserMapPoint) {
                drawingManager.setOptions({
                  drawingMode: null,
                  drawingControl: false,
                });
              }
              return newUserMapPoint;
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
