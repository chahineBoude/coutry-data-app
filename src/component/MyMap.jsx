import axios from "axios";
import React, { useState } from "react";
import { MapContainer, TileLayer, GeoJSON, Popup } from "react-leaflet";
import countries from "../data/countries.json";

import "./map.css";

function MyMap() {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [latlong, setLatLong] = useState([0, 0]);
  let lat = 36.753769;
  let long = 3.058756;

  const handleClick = (country, layer) => {
    const countryCode = country.properties.ISO_A3;
    layer.on({
      click: (e) => {
        axios
          .get(`https://restcountries.com/v3.1/alpha/${countryCode}`)
          .then((response) => {
            const nativeName = response.data[0].name.nativeName;
            const commonName = Object.values(nativeName)[0].official;
            const flag = response.data[0].flags.svg;
            const coa = response.data[0].coatOfArms.svg;
            setLatLong([e.latlng.lat, e.latlng.lng]);
            const info = {
              name: response.data[0].name.official,
              nativeName: commonName,
              capital: response.data[0].capital[0],
              population: response.data[0].population,
              flag: flag,
              coa: coa,
            };
            setSelectedCountry(info);
          });
      },
    });
  };

  const handleCancel = () => {
    setSelectedCountry(null);
  };

  return (
    <div className="app__map_info_container slide">
      <div className="map__div ">
        <MapContainer
          center={[lat, long]}
          zoom={3}
          className="map__container flex__center"
          worldCopyJump={false}
          doubleClickZoom={false}
          maxBounds={[
            [-90, -180],
            [90, 180],
          ]}
          maxBoundsViscosity={1.0}
          minZoom={3}
        >
          <GeoJSON
            style={{ weight: "1", opacity: "1", fillOpacity: "0" }}
            data={countries.features}
            onEachFeature={handleClick}
          />
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {selectedCountry && latlong && (
            <Popup position={[latlong[0], latlong[1]]}>
              <div className="p__oswald">{selectedCountry.name}</div>
              <div className="p__roboto">
                Native name: {selectedCountry.nativeName}
              </div>
              <div className="p__roboto">
                Capital City: {selectedCountry.capital}
              </div>
              <div className="p__roboto">
                Population {selectedCountry.population}
              </div>
              <div className="flag__container p__roboto">
                <img
                  src={selectedCountry.flag}
                  alt="country_flag"
                  style={{
                    height: "50%",
                    borderRadius: "7px",
                    border: "solid 0.1px rgba(0, 0, 0, .2)",
                  }}
                />
                {selectedCountry.coa && (
                  <img
                    src={selectedCountry.coa}
                    alt="country_coa"
                    style={{
                      height: "75%",
                    }}
                  />
                )}
              </div>
            </Popup>
          )}
        </MapContainer>
      </div>
    </div>
  );
}

export default MyMap;
