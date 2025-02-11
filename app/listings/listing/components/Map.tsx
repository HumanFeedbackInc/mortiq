"use client";
// import React, { useRef, useEffect, useState } from "react";
// import mapboxgl, { LngLatLike, Map } from "mapbox-gl";
// import "mapbox-gl/dist/mapbox-gl.css";
// interface MapboxMapProps {
//   wrapperClassName?: string;
//   mapClassName?: string;
//   initialOptions?: Omit<mapboxgl.MapboxOptions, "container">;
//   onMapLoaded?(map: mapboxgl.Map): void;
//   onMapRemoved?(): void;
//   latlng: number[];

// }

// function MapboxMap({
//   initialOptions = {},
//   onMapLoaded,
//   latlng,
//   wrapperClassName,
//   onMapRemoved,
// }: MapboxMapProps) {
//   const [map, setMap] = React.useState<mapboxgl.Map>();
//   const [isAtStart, setIsAtStart] = useState(true);
//   console.log("LATLNG ",latlng)
//   const mapNode = React.useRef(null);

//   React.useEffect(() => {
//     const node = mapNode.current;
//     if (typeof window === "undefined" || node === null) return;

//     // otherwise, create a map instance
//     const mapboxMap = new mapboxgl.Map({
//       container: node,
//       accessToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
//       center: [0,0],
//       zoom: 1,
//       interactive: false,
//       style:"mapbox://styles/cbizy/clqqynrao00lz01qxgk7t66rs"
//     });
//     // save the map object to React.useState
//     setMap(mapboxMap);

//     return () => {
//       mapboxMap.remove();
//     };
//   }, []);

//   useEffect(() => {
//     // Call flyToLocation when the map is set (i.e., not null)
//     if (map) {

//         flyToLocation();

//     }
// }, [map]); // Dependency array includes 'map'

// const flyToLocation = () => {

//     const end = {
//         center: {lng:latlng[0],lat:latlng[1]} as LngLatLike,
//         zoom: 16.5,
//         bearing: 130,
//         pitch: 45
//     };

//     if (map) {

//         map.flyTo({
//             // flyTo options
//             ...end,
//             duration: 10000,
//             essential: true
//         }).on("moveend", () => {
//           if(isAtStart){
//             const marker1 = new mapboxgl.Marker()
//             .setLngLat([-75.706471, 45.356071])
//             .addTo(map);
//             map.scrollZoom.enable();
//             map.dragPan.enable();
//             map.dragRotate.enable();
//             map.touchZoomRotate.enable();
//             map.touchPitch.enable();
//           }
//           // console.log("moveend");
//         });

//     setIsAtStart(!isAtStart);
//     // map["scrollZoom"].enable();

//       }
//     };

//   return (
//     <div className={wrapperClassName}>
//       {/* <link
//         href="https://api.mapbox.com/mapbox-gl-js/v3.0.1/mapbox-gl.css"
//         rel="stylesheet"
//       /> */}
//       <script>
//         map.setConfigProperty('basemap', 'lightPreset', 'dusk')
//       </script>
//       <div ref={mapNode} className={wrapperClassName} />
//     </div>
//   );
// }
import React, { useRef, useEffect, useState } from "react";
import mapboxgl, { LngLatLike } from "mapbox-gl";
// import geoJson from "../chicago-parks.json";
import "mapbox-gl/dist/mapbox-gl.css";

export type MapProps = {
  latlng: number[];
  zoom: number;
  wrapperClassName: string;
};
const Map = ({ latlng, zoom, wrapperClassName }: MapProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [lng, setLng] = useState(latlng[0]);
  const [lt, setLt] = useState(latlng[1]);
  const mlat = latlng[0].valueOf();
  const mlng = latlng[1].valueOf();
  console.log("mlng, mlat", mlng, mlat);
  const popupRef = useRef<mapboxgl.Popup | null>(null);

  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current as HTMLDivElement,
      center: latlng as LngLatLike,
      zoom: 16,
      //   style: 'mapbox://styles/mapbox/streets-v11'
    });

    // Create Street View URL
    const streetViewUrl = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${latlng[1]},${latlng[0]}`;

    // Create popup with Street View link
    const popup = new mapboxgl.Popup({
      closeOnClick: false,
      anchor: "bottom",
      offset: [0, -10],
      maxWidth: "300px",
      focusAfterOpen: false,
    }).setLngLat(latlng as LngLatLike).setHTML(`
        <div style="text-align: center;">
          <h3 style="margin-bottom: 8px;">Location</h3>
          <a href="${streetViewUrl}" target="_blank" rel="noopener noreferrer" 
             style="display: inline-block; padding: 8px 16px; background: #4285f4; color: white; 
                    text-decoration: none; border-radius: 4px; font-size: 14px;">
            Open Street View
          </a>
        </div>
      `);

    popupRef.current = popup;

    // Add popup after map loads
    map.on("load", () => {
      popup.addTo(map);
    });

    // Update popup position on move
    map.on("move", () => {
      popup.setLngLat(latlng as LngLatLike);
    });

    return () => {
      if (popupRef.current) {
        popupRef.current.remove();
      }
      map.remove();
    };
  }, [latlng, zoom]);

  return (
    <div>
      <div className="sidebar">
        Longitude: {lng} | Latitude: {lt} | Zoom: {zoom}
      </div>
      <div
        className="map-container h-[500px] rounded-lg"
        ref={mapContainerRef}
      />
    </div>
  );
};

export default Map;
