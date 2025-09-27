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

      const map = L.map(mapRef.current, { zoomControl: true }).setView([20, 30], 2);

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

      // ensure markercluster plugin is available, load if missing
      const ensureCluster = async (): Promise<any> => {
        if ((window as any).L && (window as any).L.markerClusterGroup) return (window as any).L.markerClusterGroup;
        // load CSS
        if (!document.querySelector("link[data-leaflet-cluster]")) {
          const lnk2 = document.createElement("link");
          lnk2.rel = "stylesheet";
          lnk2.href = "https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css";
          lnk2.setAttribute("data-leaflet-cluster", "1");
          document.head.appendChild(lnk2);
          const lnk3 = document.createElement("link");
          lnk3.rel = "stylesheet";
          lnk3.href = "https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css";
          lnk3.setAttribute("data-leaflet-cluster-default", "1");
          document.head.appendChild(lnk3);
        }

        if ((window as any).L && !(window as any).L.markerClusterGroup) {
          await new Promise<void>((res) => {
            const s = document.createElement("script");
            s.src = "https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js";
            s.async = true;
            s.onload = () => res();
            document.body.appendChild(s);
          });
        }
        return (window as any).L.markerClusterGroup;
      };

      ensureCluster().then((markerClusterGroup: any) => {
        const cluster = markerClusterGroup();
        locations.forEach((loc) => {
          const m = L.marker(loc.coords);
          m.bindPopup(`${loc.label}`);
          cluster.addLayer(m);
        });
        map.addLayer(cluster);

        // fit to cluster bounds
        try {
          map.fitBounds(cluster.getBounds().pad(0.6));
        } catch (e) {
          // fallback center
          map.setView([20, 30], 2);
        }

        mapInstanceRef.current = map;
      });
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
