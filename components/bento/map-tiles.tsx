'use client';

import { useEffect, useRef } from 'react';
import type { Map as MapLibreMap } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

// bento's map widget: a light map centred on the owner's place, with bento's
// pulsing location pin. MapLibre (the open Mapbox GL fork bento's map was
// built on) with OpenFreeMap's Positron style, so no API key is needed. The
// library loads only when a map is on the page.

const STYLE = 'https://tiles.openfreemap.org/styles/positron';

export function MapTiles({
  lat,
  lng,
  zoom = 11,
  interactive = false,
}: {
  lat: number;
  lng: number;
  zoom?: number;
  // Visitors can pan and zoom; in the editor the tile stays draggable.
  interactive?: boolean;
}) {
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<MapLibreMap | null>(null);

  useEffect(() => {
    let cancelled = false;
    import('maplibre-gl').then(({ AttributionControl, Map, Marker }) => {
      if (cancelled || !container.current) return;
      map.current = new Map({
        container: container.current,
        style: STYLE,
        center: [lng, lat],
        zoom,
        interactive,
        attributionControl: false,
        cooperativeGestures: interactive,
      });
      // The credit as a small ⓘ, closed, clear of the caption.
      map.current.addControl(
        new AttributionControl({ compact: true }),
        'bottom-right'
      );
      map.current.once('load', () =>
        container.current
          ?.querySelector('.maplibregl-compact-show')
          ?.classList.remove('maplibregl-compact-show')
      );
      const pin = document.createElement('div');
      pin.innerHTML =
        '<span class="bento-location-pulse absolute left-1/2 top-1/2 h-[26px] w-[26px] rounded-full bg-[#5871ff]"></span>' +
        '<img src="/home/bento/location.png" alt="" width="26" class="relative rounded-full shadow-[0_4px_24px_rgba(0,0,0,.3)]" />';
      pin.className = 'relative h-[26px] w-[26px]';
      new Marker({ element: pin }).setLngLat([lng, lat]).addTo(map.current);
    });
    // Follow the tile's size (layout changes, the phone grid).
    const observer = new ResizeObserver(() => map.current?.resize());
    if (container.current) observer.observe(container.current);
    return () => {
      cancelled = true;
      observer.disconnect();
      map.current?.remove();
      map.current = null;
    };
  }, [lat, lng, zoom, interactive]);

  // MapLibre's own CSS makes its container position: relative, so the
  // container fills a positioned wrapper instead.
  return (
    <div className="absolute inset-0 bg-[#f2f3f0]">
      <div ref={container} className="h-full w-full" />
    </div>
  );
}
