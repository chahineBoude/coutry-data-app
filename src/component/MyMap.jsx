import axios from "axios";
import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import countries from "../data/countries.json";

import "./map.css";

function MyMap() {
  const [selectedCountry, setSelectedCountry] = useState(null);
  let lat = 36.753769;
  let long = 3.058756;

  const handleClick = (country, layer) => {
    const countryCode = country.properties.ISO_A3;
    layer.on({
      click: (event) => {
        axios
          .get(`https://restcountries.com/v3.1/alpha/${countryCode}`)
          .then((response) => {
            const info = {
              name: response.data[0].name.official,
              "native name": response.data[0].name.nativeName,
              capital: response.data[0].capital[0],
              population: response.data[0].population,
            };

            const nativeName = info["native name"];
            const commonName = Object.values(nativeName)[0].official;
            layer.bindPopup(commonName);
          });
      },
    });
  };

  return (
    <div className="map__div  ">
      <MapContainer
        center={[lat, long]}
        zoom={3}
        className="map__container flex__center"
        doubleClickZoom={false}
      >
        <GeoJSON
          style={{ weight: "1", opacity: "1", fillOpacity: "0" }}
          data={countries.features}
          onEachFeature={handleClick}
        />
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      </MapContainer>
    </div>
  );
}

export default MyMap;
