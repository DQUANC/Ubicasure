"use client";

import { useState, useEffect, useCallback } from "react";
import { GoogleMapView } from "./google-map-view";
import { StationInfoPanel } from "@/components/stations/station-info-panel";
import { CreateStationDialog } from "@/components/stations/create-station-dialog";
import { useAuth } from "@/context/auth-context";
import type { Station } from "@/lib/types";
import {
  getStations,
  getPoliceNational,
  getPoliceMunicipal,
  getPoliceAll,
  getFireMunicipal,
  getFireVolunteer,
  getFireAll,
} from "@/lib/api";

export type StationView =
  | "all"
  | "police-national"
  | "police-municipal"
  | "police-all"
  | "fire-municipal"
  | "fire-volunteer"
  | "fire-all";

const FETCHERS: Record<StationView, () => Promise<Station[]>> = {
  all: getStations,
  "police-national": getPoliceNational,
  "police-municipal": getPoliceMunicipal,
  "police-all": getPoliceAll,
  "fire-municipal": getFireMunicipal,
  "fire-volunteer": getFireVolunteer,
  "fire-all": getFireAll,
};

export function MapPage({ view }: { view: StationView }) {
  const { isAdmin } = useAuth();
  const [stations, setStations] = useState<Station[]>([]);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [infoOpen, setInfoOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [locationPickMode, setLocationPickMode] = useState(false);
  const [pendingPin, setPendingPin] = useState<{ lat: number; lng: number } | null>(null);

  const loadStations = useCallback(async () => {
    try {
      const data = await FETCHERS[view]();
      setStations(data);
    } catch {
      // silent fail — station list is best-effort
    }
  }, [view]);

  useEffect(() => {
    loadStations();
  }, [loadStations]);

  function handleMarkerClick(station: Station) {
    setSelectedStation(station);
    setInfoOpen(true);
  }

  function handleLocationPick(lat: number, lng: number) {
    setPendingPin({ lat, lng });
    setLocationPickMode(false);
  }

  return (
    <div className="relative w-full h-full">
      <GoogleMapView
        stations={stations}
        onMarkerClick={handleMarkerClick}
        onLocationPick={handleLocationPick}
        locationPickMode={locationPickMode}
        pendingPin={pendingPin}
        isAdmin={isAdmin}
        onAddClick={() => setCreateOpen(true)}
      />

      <StationInfoPanel
        station={selectedStation}
        open={infoOpen}
        onClose={() => setInfoOpen(false)}
        onRefresh={loadStations}
      />

      {isAdmin && (
        <CreateStationDialog
          open={createOpen}
          onClose={() => {
            setCreateOpen(false);
            setLocationPickMode(false);
          }}
          onRefresh={loadStations}
          locationPickMode={locationPickMode}
          onEnableLocationPick={() => {
            setLocationPickMode(true);
            setCreateOpen(false);
          }}
          pendingPin={pendingPin}
          onClearPin={() => setPendingPin(null)}
        />
      )}
    </div>
  );
}
