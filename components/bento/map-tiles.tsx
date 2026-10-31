'use client';

import { useEffect, useRef } from 'react';
import type { Map as MapboxMap } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// bento's map widget: a light map centred on the owner's place, with bento's
// pulsing location pin. Mapbox GL with its light style; the public token
// comes from NEXT_PUBLIC_MAPBOX_TOKEN. The library loads only when a map is
// on the page.

const STYLE = 'mapbox://styles/mapbox/light-v11';
const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

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
  const map = useRef<MapboxMap | null>(null);

  useEffect(() => {
    if (!TOKEN) return;
    let cancelled = false;
    import('mapbox-gl').then(({ default: mapbox }) => {
      if (cancelled || !container.current) return;
      const { AttributionControl, Map, Marker } = mapbox;
      map.current = new Map({
        accessToken: TOKEN,
        container: container.current,
        style: STYLE,
        center: [lng, lat],
        zoom,
        interactive,
        attributionControl: false,
        // Top left: the caption covers the bottom-left corner.
        logoPosition: 'top-left',
        cooperativeGestures: interactive,
      });
      // The credit as a small ⓘ, closed, clear of the caption.
      map.current.addControl(
        new AttributionControl({ compact: true }),
        'bottom-right'
      );
      // Mapbox opens the credit again as its sources load: close it on the
      // first load and when the map first settles.
      const collapse = () =>
        container.current
          ?.querySelector('.mapboxgl-compact-show')
          ?.classList.remove('mapboxgl-compact-show');
      map.current.once('load', collapse);
      map.current.once('idle', collapse);
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

  // Mapbox's own CSS makes its container position: relative, so the
  // container fills a positioned wrapper instead.
  return (
    <div className="absolute inset-0 bg-[#f2f3f0]">
      <div ref={container} className="h-full w-full" />
    </div>
  );
}
