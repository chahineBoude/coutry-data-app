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
import { BsFillFlagFill } from "react-icons/bs";
import { GiCancel } from "react-icons/gi";

import "./map.css";

function MyMap() {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [latlong, setLatLong] = useState([0, 0]);
  let lat = 36.753769;
  let long = 3.058756;

  const handleClick = (country, layer) => {
    const countryCode = country.properties.ISO_A3;
    layer.on({
      click: () => {
        axios
          .get(`https://restcountries.com/v3.1/alpha/${countryCode}`)
          .then((response) => {
            const nativeName = response.data[0].name.nativeName;
            const commonName = Object.values(nativeName)[0].official;
            const flag = response.data[0].flags.svg;
            const coa = response.data[0].coatOfArms.svg;
            console.log(flag);
            const info = {
              name: response.data[0].name.official,
              nativeName: commonName,
              capital: response.data[0].capital[0],
              population: response.data[0].population,
              flag: flag,
              coa: coa,
            };
            console.log(info);
            setSelectedCountry(info);
          });
      },
    });
  };

  const handleCancel = () => {
    setSelectedCountry(null);
  };

  useEffect(() => {
    console.log(selectedCountry);
    if (selectedCountry) {
      const name = selectedCountry.name;
      axios
        .get(
          `https://api.opencagedata.com/geocode/v1/json?q=${name}&key=4378b67f39ea4c9d82e7b34cd72d53b7`
        )
        .then((response) => {
          const hey = response.data.results[0].geometry;
          console.log(hey);
          setLatLong([hey.lat, hey.lng]);
        });
    }
  }, [selectedCountry]);

  useEffect(() => {
    console.log(latlong[1]);
  }, [latlong]);

  return (
    <div className="app__map_info_container slide">
      {/* {selectedCountry && (
        <div className="app__country_info headtext__oswald slide">
          <GiCancel className="overlay__close" onClick={handleCancel} />

          <div>{selectedCountry.name}</div>
          <div className="p__roboto">
            Native name: {selectedCountry.nativeName}
          </div>
          <div className="p__roboto">
            Capital: City {selectedCountry.capital}
          </div>
          <div className="p__roboto">
            Population {selectedCountry.population}
          </div>
          <div className="flag__container p__roboto">
            <BsFillFlagFill style={{ marginBottom: "1rem" }} />
            <img
              src={selectedCountry.flag}
              alt="country_flag"
              style={{ height: "50%", borderRadius: "15px" }}
            />
          </div>
        </div>
      )} */}

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
                Capital: City {selectedCountry.capital}
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
                <img
                  src={selectedCountry.coa}
                  alt="country_coa"
                  style={{
                    height: "50%",
                  }}
                />
              </div>
            </Popup>
          )}
        </MapContainer>
      </div>
    </div>
  );
}

export default MyMap;
