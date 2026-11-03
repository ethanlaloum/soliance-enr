import { LngLatBounds, Map as MapLibreMap, Marker, NavigationControl, Popup, setWorkerUrl, type MapLayerMouseEvent } from 'maplibre-gl';
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?url';
import 'maplibre-gl/dist/maplibre-gl.css';
import '@/components/home/createInstallationsMap.css';
import type { InstallationLocation } from '@/app/installations/domain/entities/InstallationLocation';
import type { GeoPoint } from '@/app/service-areas/domain/entities/ServiceArea';

// MapLibre looks for its worker next to its own bundle, which Vite renames: give it the emitted file.
setWorkerUrl(workerUrl);

const positronStyleUrl = 'https://tiles.openfreemap.org/styles/positron';
const sourceId = 'installations';
const solar = '#E07B28';
// Alpes-Maritimes and Var hold almost every installation: the map opens on them, the few far ones show on zoom out.
const homeDepartments = ['06', '83'];

export interface InstallationsMapTexts {
  agency: string;
  popup: (location: InstallationLocation) => string;
  locale: Record<string, string>;
}

export interface InstallationsMapOptions {
  container: HTMLElement;
  locations: InstallationLocation[];
  agency: GeoPoint;
  texts: InstallationsMapTexts;
}

const boundsOf = (points: GeoPoint[]): LngLatBounds =>
  points.reduce(
    (bounds, { longitude, latitude }) => bounds.extend([longitude, latitude]),
    new LngLatBounds([points[0].longitude, points[0].latitude], [points[0].longitude, points[0].latitude]),
  );

// Dot on the office, label hanging below it over the sea, so it never hides the dense Nice / Antibes markers.
const agencyMarkerElement = (label: string): HTMLElement => {
  const element = document.createElement('div');
  element.className = 'pointer-events-none flex flex-col items-center gap-1';
  const dot = document.createElement('span');
  dot.className = 'h-2.5 w-2.5 rounded-full bg-night ring-2 ring-white';
  const text = document.createElement('span');
  text.className = 'rounded-full bg-night px-2 py-0.5 text-[11px] font-semibold text-white shadow-md';
  text.textContent = label;
  element.append(dot, text);
  return element;
};

export const createInstallationsMap = ({ container, locations, agency, texts }: InstallationsMapOptions): MapLibreMap => {
  const homeLocations = locations.filter(({ inseeCode }) => homeDepartments.some((department) => inseeCode.startsWith(department)));
  const map = new MapLibreMap({
    container,
    style: positronStyleUrl,
    bounds: boundsOf(homeLocations.map(({ location }) => location)),
    fitBoundsOptions: { padding: 28 },
    minZoom: 4,
    maxZoom: 13,
    dragRotate: false,
    pitchWithRotate: false,
    touchPitch: false,
    cooperativeGestures: true,
    attributionControl: { compact: true },
    locale: texts.locale,
  });
  map.touchZoomRotate.disableRotation();
  map.addControl(new NavigationControl({ showCompass: false }), 'top-right');

  map.on('load', () => {
    // The compact attribution opens on load on a wide map; keep it folded behind its (i) button.
    container.querySelector('.maplibregl-ctrl-attrib')?.classList.remove('maplibregl-compact-show');
    container.querySelector('.maplibregl-ctrl-attrib')?.removeAttribute('open');
    map.addSource(sourceId, {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: locations.map((location, index) => ({
          type: 'Feature',
          id: index,
          properties: { index, count: location.count },
          geometry: { type: 'Point', coordinates: [location.location.longitude, location.location.latitude] },
        })),
      },
    });
    map.addLayer({
      id: sourceId,
      type: 'circle',
      source: sourceId,
      paint: {
        'circle-color': solar,
        'circle-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 0.95, 0.72],
        'circle-radius': ['interpolate', ['linear'], ['sqrt', ['get', 'count']], 1, 5, 4, 12],
        'circle-stroke-color': '#ffffff',
        'circle-stroke-width': 1.5,
      },
    });

    new Marker({ element: agencyMarkerElement(texts.agency), anchor: 'top', offset: [0, -5] })
      .setLngLat([agency.longitude, agency.latitude])
      .addTo(map);

    const popup = new Popup({ closeButton: false, closeOnClick: false, offset: 10, className: 'installations-popup' });
    let hoveredId: number | null = null;
    const show = (event: MapLayerMouseEvent) => {
      const feature = event.features?.[0];
      if (!feature || feature.geometry.type !== 'Point') return;
      const location = locations[Number(feature.properties.index)];
      if (hoveredId !== null) map.setFeatureState({ source: sourceId, id: hoveredId }, { hover: false });
      hoveredId = Number(feature.id);
      map.setFeatureState({ source: sourceId, id: hoveredId }, { hover: true });
      map.getCanvas().style.cursor = 'pointer';
      popup
        .setLngLat(feature.geometry.coordinates as [number, number])
        .setText(texts.popup(location))
        .addTo(map);
    };
    const hide = () => {
      if (hoveredId !== null) map.setFeatureState({ source: sourceId, id: hoveredId }, { hover: false });
      hoveredId = null;
      map.getCanvas().style.cursor = '';
      popup.remove();
    };
    map.on('mousemove', sourceId, show);
    map.on('click', sourceId, show);
    map.on('mouseleave', sourceId, hide);
  });

  return map;
};
