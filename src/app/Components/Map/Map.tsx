"use client";

import { Loader } from "@googlemaps/js-api-loader";
import { useRef, useEffect, Dispatch, useState } from "react";
import { GoogleMapPoint } from "@/app/Interfaces/interfaces";

interface Props {
  mapLocations: Array<GoogleMapPoint>;
  setNewUserLocCoords: Dispatch<
    React.SetStateAction<{ lat: string; lng: string } | null>
  >;
  newUserLocMarker: google.maps.Marker | null;
  setNewUserLocMarker: Dispatch<
    React.SetStateAction<google.maps.Marker | null>
  >;
}

export default function Map({
  mapLocations,
  setNewUserLocCoords,
  newUserLocMarker,
  setNewUserLocMarker,
}: Props) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const drawingManagerRef = useRef<google.maps.drawing.DrawingManager | null>(
    null
  );
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!;

  useEffect(() => {
    const loader = new Loader({
      apiKey: apiKey,
      version: "weekly",
      libraries: ["drawing"],
    });

    let map: google.maps.Map | null = null;

    loader.importLibrary("maps").then(() => {
      if (mapRef.current) {
        mapInstanceRef.current = new google.maps.Map(mapRef.current, {
          center: { lat: 40, lng: -105.5 },
          zoom: 10,
        });
        setMapLoaded(true);
      }

      drawingManagerRef.current = new google.maps.drawing.DrawingManager({
        drawingMode: google.maps.drawing.OverlayType.MARKER,
        drawingControl: true,
        drawingControlOptions: {
          position: google.maps.ControlPosition.BOTTOM_CENTER,
          drawingModes: [google.maps.drawing.OverlayType.MARKER],
        },
        markerOptions: {
          icon: undefined,
          label: {
            text: "Your new location!",
            fontFamily: "'Tahoma', sans-serif",
            fontSize: "16px",
            fontWeight: "700",
            color: "rgb(0 15 255)",
          },
        },
      });

      if (drawingManagerRef.current) {
        drawingManagerRef.current.setMap(mapInstanceRef.current);
      }

      google.maps.event.addListener(
        drawingManagerRef.current,
        "overlaycomplete",
        function (event) {
          if (
            event.type === google.maps.drawing.OverlayType.MARKER &&
            newUserLocMarker === null
          ) {
            setNewUserLocMarker(event.overlay);

            const markerPosition = event.overlay.getPosition();

            const newUserMapPoint: { lat: string; lng: string } = {
              lat: markerPosition.lat().toFixed(6),
              lng: markerPosition.lng().toFixed(6),
            };

            setNewUserLocCoords(newUserMapPoint);
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

  useEffect(() => {
    if (mapLocations.length && mapLoaded && mapRef.current) {
      markersRef.current?.forEach((marker) => marker.setMap(null));
      markersRef.current = [];

      mapLocations.forEach((location) => {
        const marker = new google.maps.Marker({
          position: location.coords,
          map: mapInstanceRef.current!,
          label: {
            text: location.name,
            fontFamily: "'Tahoma', sans-serif",
            fontSize: "12px",
            fontWeight: "700",
          },
          clickable: false,
        });

        markersRef.current.push(marker);
      });
    }
  }, [mapLocations, mapLoaded]);

  useEffect(() => {
    // Enables and disables ability to add markers based on if there
    // is a newUserLocMarker or not
    if (!mapLoaded || !drawingManagerRef.current) return;
    if (newUserLocMarker !== null) {
      drawingManagerRef.current.setOptions({
        drawingMode: null,
        drawingControl: false,
      });
    } else if (newUserLocMarker === null) {
      drawingManagerRef.current.setOptions({
        drawingMode: google.maps.drawing.OverlayType.MARKER,
        drawingControl: true,
      });
    }
  }, [newUserLocMarker, mapLoaded]);

  return (
    <>
      <div
        ref={mapRef}
        role="application"
        aria-label="Google map display of default and user created locations"
        style={{ height: "100%", width: "100%" }}
      />
    </>
  );
}
