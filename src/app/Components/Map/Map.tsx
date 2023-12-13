"use client";

import { Loader } from "@googlemaps/js-api-loader";
import MapMarker from "../MapMarker/MapMarker";
import { useRef, useEffect } from "react";

export default function Map() {
  const mapRef = useRef(null);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!;

  useEffect(() => {
    const loader = new Loader({
      apiKey: apiKey,
      version: "weekly",
      libraries: ["drawing"]
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
          icon: "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png",
          clickable: true,
          draggable: true,
        },
      });

      drawingManager.setMap(map);

      google.maps.event.addListener(
        drawingManager,
        "overlaycomplete",
        function (event) {
          if (event.type === google.maps.drawing.OverlayType.MARKER) {
            // Get the position of the marker
            const markerPosition = event.overlay.getPosition();

            // Process the marker position (latitude and longitude)
            console.log(
              markerPosition.lat().toFixed(6),
              markerPosition.lng().toFixed(6)
            );

            // Add dragend event listener to the marker
            google.maps.event.addListener(
              event.overlay,
              "dragend",
              function () {
                const newPosition = event.overlay.getPosition();
                console.log(
                  "Marker dragged to: ",
                  newPosition.lat().toFixed(6),
                  newPosition.lng().toFixed(6)
                );
                // Use or store the new position as needed
              }
            );
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
