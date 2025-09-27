import React, { useEffect, useRef } from "react";

// This component loads Leaflet from CDN and initializes a map with markers for specified offices.
export default function InteractiveMap() {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const leafletRef = useRef<any>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    // load CSS
    if (!document.querySelector("link[data-leaflet]")) {
      const lnk = document.createElement("link");
      lnk.rel = "stylesheet";
      lnk.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      lnk.setAttribute("data-leaflet", "1");
      document.head.appendChild(lnk);
    }

    let cancelled = false;

    const loadScript = async () => {
      if ((window as any).L) {
        leafletRef.current = (window as any).L;
        initMap();
        return;
      }

      const script = document.createElement("script");
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.async = true;
      script.onload = () => {
        if (cancelled) return;
        leafletRef.current = (window as any).L;
        initMap();
      };
      document.body.appendChild(script);
    };

    const initMap = () => {
      const L = leafletRef.current;
      if (!L || !mapRef.current) return;

      // avoid double init
      if (mapInstanceRef.current) return;

      const map = L.map(mapRef.current, { zoomControl: false }).setView([20, 30], 2);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "© OpenStreetMap",
      }).addTo(map);

      const locations = [
        { label: "USA", coords: [40.7128, -74.006] },
        { label: "Dubai", coords: [25.2048, 55.2708] },
        { label: "India", coords: [19.076, 72.8777] },
        { label: "Kuwait", coords: [29.3759, 47.9774] },
        { label: "Qatar", coords: [25.2854, 51.531] },
      ];

      locations.forEach((loc) => {
        const marker = L.marker(loc.coords).addTo(map);
        marker.bindPopup(`<strong>${loc.label}</strong><br/>Currently working`).openPopup();
      });

      mapInstanceRef.current = map;

      // fit to markers
      const group = L.featureGroup(locations.map((l) => L.marker(l.coords)));
      map.fitBounds(group.getBounds().pad(0.6));
    };

    loadScript();

    return () => {
      cancelled = true;
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (e) {
          // ignore
        }
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="h-64 w-full rounded-xl overflow-hidden" ref={mapRef} aria-hidden />
  );
}
