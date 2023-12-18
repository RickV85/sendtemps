"use client";

import { Loader } from "@googlemaps/js-api-loader";
import { useRef, useEffect, Dispatch, useState } from "react";
import { GoogleMapPoint } from "@/app/Interfaces/interfaces";

interface Props {
  mapLocations: Array<GoogleMapPoint>;
  setNewUserLocCoords: Dispatch<
    React.SetStateAction<{ lat: number; lng: number } | null>
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

  const [displayLocations, setDisplayLocations] = useState<
    GoogleMapPoint[] | []
  >([]);
  const mapRef = useRef(null);
  const drawingManagerRef = useRef<google.maps.drawing.DrawingManager | null>(
    null
  );
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!;

  useEffect(() => {
    if (mapLocations.length) {
      setDisplayLocations(mapLocations);
    }
  }, [mapLocations]);

  useEffect(() => {
    // Enables and disables ability to add markers based on if there
    // is a newUserLocMarker or not
    if (newUserLocMarker !== null && drawingManagerRef.current) {
      drawingManagerRef.current.setOptions({
        drawingMode: null,
        drawingControl: false,
      });
    } else if (newUserLocMarker === null && drawingManagerRef.current) {
      drawingManagerRef.current.setOptions({
        drawingMode: google.maps.drawing.OverlayType.MARKER,
        drawingControl: true,
      });
    }
  }, [newUserLocMarker]);

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

      displayLocations.forEach((location: GoogleMapPoint) => {
        if (map !== null) {
          new google.maps.Marker({
            position: location.coords,
            map: map,
            label: {
              text: location.name,
              fontFamily: "'Tahoma', sans-serif",
              fontSize: "12px",
              fontWeight: "700",
            },
            clickable: false,
          });
        }
      });

      drawingManagerRef.current = new google.maps.drawing.DrawingManager({
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
            fontFamily: "'Tahoma', sans-serif",
            fontSize: "16px",
            fontWeight: "700",
            color: "rgb(0 15 255)",
          },
        },
      });

      if (drawingManagerRef.current) {
        drawingManagerRef.current.setMap(map);
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

            const newUserMapPoint: { lat: number; lng: number } = {
              lat: markerPosition.lat().toFixed(6),
              lng: markerPosition.lng().toFixed(6),
            };

            setNewUserLocCoords(newUserMapPoint);
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
  }, [displayLocations]);

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
