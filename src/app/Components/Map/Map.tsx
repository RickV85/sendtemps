"use client";

import { Loader } from "@googlemaps/js-api-loader";
import { useRef, useEffect, Dispatch, useState } from "react";
import { GoogleMapPoint } from "@/app/Interfaces/interfaces";

interface Props {
  mapLocations: Array<GoogleMapPoint>;
  setNewUserLocCoords: Dispatch<
    React.SetStateAction<{ lat: string; lng: string } | null>
  >;
  newUserLocMarker: google.maps.marker.AdvancedMarkerElement | null;
  setNewUserLocMarker: Dispatch<
    React.SetStateAction<google.maps.marker.AdvancedMarkerElement | null>
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
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
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

    loader.importLibrary("maps").then(() => {
      if (mapRef.current) {
        mapInstanceRef.current = new google.maps.Map(mapRef.current, {
          center: { lat: 40, lng: -105.5 },
          zoom: 10,
          fullscreenControl: false,
          streetViewControl: false,
          mapId: "6696e534c9ad2933",
        });
        setMapLoaded(true);
      }

      // No drawing mode available for AdvancedMarkerElement
      // as of 2.5.24. This creates a legacy Marker object
      // and throws a console warning about the deprecation.
      // If update available, would need to update all references
      // to google.maps.drawing.OverlayType.MARKER.
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

        google.maps.event.addListener(
          drawingManagerRef.current,
          "overlaycomplete",
          function (event: any) {
            if (
              event.type === google.maps.drawing.OverlayType.MARKER &&
              newUserLocMarker === null
            ) {
              const marker = event.overlay;

              const newUserMapPoint: { lat: string; lng: string } = {
                lat: marker.position.lat().toFixed(6),
                lng: marker.position.lng().toFixed(6),
              };

              // See comment at line 52
              console.log(
                `Ignore deprecation warning on new map marker creation.
                 Update to AdvancedMarkerElement not yet available for drawing mode markers.`
              );
              setNewUserLocMarker(marker);
              setNewUserLocCoords(newUserMapPoint);
            }
          }
        );
      }
    });
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    const resetAndCreateMarkers = async () => {
      if (mapLocations.length && mapLoaded && mapRef.current) {
        // Removes all markers from map before creating new
        markersRef.current?.forEach((marker) => (marker.position = null));
        markersRef.current = [];

        // Load AdvancedMarkerElement
        const { AdvancedMarkerElement, PinElement } =
          (await google.maps.importLibrary(
            "marker"
          )) as google.maps.MarkerLibrary;

        mapLocations.forEach((location) => {
          const marker = new AdvancedMarkerElement({
            position: location.coords,
            map: mapInstanceRef.current!,
            title: location.name,
          });

          markersRef.current.push(marker);
        });
      }
    };

    resetAndCreateMarkers();
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
    <div
      ref={mapRef}
      role="application"
      aria-label="Google map display of default and user created locations"
      style={{ height: "100%", width: "100%" }}
    />
  );
}
