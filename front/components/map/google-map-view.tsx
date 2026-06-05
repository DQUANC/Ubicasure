"use client";

import { useState, useCallback, useEffect } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  useMap,
  useMapsLibrary,
  type MapMouseEvent,
} from "@vis.gl/react-google-maps";
import { SAN_SALVADOR_CENTER, MARKER_ICONS } from "@/lib/constants";
import type { Station } from "@/lib/types";

const MAPS_KEY = process.env.NEXT_PUBLIC_MAPS_API_KEY ?? "";

interface GoogleMapViewProps {
  stations: Station[];
  onMarkerClick: (station: Station) => void;
  onLocationPick?: (lat: number, lng: number) => void;
  locationPickMode?: boolean;
  pendingPin?: { lat: number; lng: number } | null;
  isAdmin?: boolean;
  onAddClick?: () => void;
}

function MapControls({
  onCenter,
  isAdmin,
  onAddClick,
}: {
  onCenter: () => void;
  isAdmin?: boolean;
  onAddClick?: () => void;
}) {
  return (
    <div className="absolute top-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
      <button
        onClick={onCenter}
        className="px-3 py-1.5 text-sm bg-white rounded shadow-md border border-gray-200 hover:bg-gray-50 font-medium"
      >
        Centrar Mapa
      </button>
      {isAdmin && (
        <button
          onClick={onAddClick}
          className="px-3 py-1.5 text-sm bg-[#1a237e] text-white rounded shadow-md hover:bg-[#0d1557] font-medium"
        >
          + Agregar Estación
        </button>
      )}
    </div>
  );
}

function PlacesLayer() {
  const map = useMap();
  const places = useMapsLibrary("places");
  const [seenLocations] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!map || !places) return;
    const currentMap: google.maps.Map = map;

    const service = new places.PlacesService(currentMap);
    const gridPoints = [
      { lat: 14.6465, lng: -90.5352 },
      { lat: 14.652, lng: -90.5935 },
      { lat: 14.5476, lng: -90.5624 },
      { lat: 14.5638, lng: -90.4879 },
    ];
    const searchTerms = [
      { name: "Bombero Voluntario", icon: MARKER_ICONS["Bombero Voluntario"], exclude: ["municipales"] },
      { name: "Bombero Municipal", icon: MARKER_ICONS["Bombero Municipal"], exclude: ["voluntarios"] },
      { name: "Policia Nacional", icon: MARKER_ICONS["Policia Nacional"], exclude: [] },
      { name: "Policia Municipal", icon: MARKER_ICONS["Policia Municipal"], exclude: ["nacional", "pnc"] },
    ];

    function createPlaceMarker(
      result: google.maps.places.PlaceResult,
      icon: string,
      excludeTerms: string[]
    ) {
      if (!result.geometry?.location) return;
      const nameLower = result.name?.toLowerCase() ?? "";
      if (excludeTerms.some((t) => nameLower.includes(t))) return;
      const key = `${result.geometry.location.lat()},${result.geometry.location.lng()}`;
      if (seenLocations.has(key)) return;
      seenLocations.add(key);

      const imgEl = document.createElement("img");
      imgEl.src = icon;
      imgEl.style.width = "28px";
      imgEl.style.height = "28px";
      const marker = new google.maps.marker.AdvancedMarkerElement({
        map: currentMap,
        position: result.geometry.location,
        content: imgEl,
      });

      marker.addListener("click", () => {
        if (!result.place_id || !places) return;
        new places.PlacesService(currentMap).getDetails(
          { placeId: result.place_id },
          (detail) => {
            if (!detail) return;
            const hours = detail.opening_hours?.weekday_text?.join("\n") ?? "";
            const iw = new google.maps.InfoWindow({
              content: `
                <div style="font-size:13px;max-width:220px">
                  <b>${detail.name ?? ""}</b><br/>
                  ${detail.vicinity ? `<span>${detail.vicinity}</span><br/>` : ""}
                  ${detail.formatted_phone_number ? `📞 ${detail.formatted_phone_number}<br/>` : ""}
                  ${detail.rating ? `⭐ ${detail.rating}<br/>` : ""}
                  ${hours ? `<br/><small>${hours.replace(/\n/g, "<br/>")}</small>` : ""}
                </div>`,
            });
            iw.open({ anchor: marker, map: currentMap });
          }
        );
      });
    }

    const { OK } = places.PlacesServiceStatus;
    let delay = 0;
    for (const term of searchTerms) {
      for (const pt of gridPoints) {
        const req = { location: pt, name: term.name, radius: 5000 };
        setTimeout(() => {
          service.nearbySearch(req, (results, status) => {
            if (status !== OK || !results) return;
            results.forEach((r) =>
              createPlaceMarker(r, term.icon, term.exclude)
            );
          });
        }, delay);
        delay += 300;
      }
    }
  }, [map, places, seenLocations]);

  return null;
}

function InnerMap({
  stations,
  onMarkerClick,
  onLocationPick,
  locationPickMode,
  pendingPin,
  isAdmin,
  onAddClick,
}: Omit<GoogleMapViewProps, "stations"> & { stations: Station[] }) {
  const map = useMap();
  const [center, setCenter] = useState(SAN_SALVADOR_CENTER);

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (pos) => setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setCenter(SAN_SALVADOR_CENTER)
    );
  }, []);

  const handleMapClick = useCallback(
    (e: MapMouseEvent) => {
      if (locationPickMode && onLocationPick && e.detail.latLng) {
        onLocationPick(e.detail.latLng.lat, e.detail.latLng.lng);
      }
    },
    [locationPickMode, onLocationPick]
  );

  function handleCenter() {
    if (map) map.panTo(center);
  }

  return (
    <div className="relative w-full h-full">
      <Map
        defaultCenter={center}
        defaultZoom={14}
        mapId="ubicasure-map"
        gestureHandling="greedy"
        disableDefaultUI={false}
        onClick={handleMapClick}
        style={{ cursor: locationPickMode ? "crosshair" : "auto" }}
      >
        {stations.map((s) => (
          <AdvancedMarker
            key={s._id}
            position={{ lat: s.lat, lng: s.lng }}
            onClick={() => onMarkerClick(s)}
            title={s.name}
          >
            <img
              src={MARKER_ICONS[s.type]}
              alt={s.type}
              style={{ width: 28, height: 28 }}
            />
          </AdvancedMarker>
        ))}

        {pendingPin && (
          <AdvancedMarker position={pendingPin}>
            <div className="w-5 h-5 rounded-full bg-[#1a237e] border-2 border-white shadow" />
          </AdvancedMarker>
        )}

        <PlacesLayer />
      </Map>

      <MapControls
        onCenter={handleCenter}
        isAdmin={isAdmin}
        onAddClick={onAddClick}
      />
    </div>
  );
}

export function GoogleMapView(props: GoogleMapViewProps) {
  return (
    <APIProvider apiKey={MAPS_KEY} libraries={["places", "marker"]}>
      <InnerMap {...props} />
    </APIProvider>
  );
}
