import axios from "axios";
import React, { useState, Fragment } from "react";
import { MapContainer, TileLayer, GeoJSON, Popup } from "react-leaflet";
import country from "../data/countries.json";
import Header from "./Header";

import "./map.css";

function MyMap() {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [countryC, setCountryCode] = useState(null);
  const [nativeName, setNativeName] = useState([]);
  const [latlong, setLatLong] = useState([0, 0]);
  let lat = 36.753769;
  let long = 3.058756;

  const handleClick = (country, layer) => {
    const countryCode = country.properties.ISO_A3;
    setCountryCode(countryCode);
    layer.on({
      click: async (e) => {
        const response = await axios.get(
          `https://restcountries.com/v3.1/alpha/${countryCode}`
        );

        const native = response.data[0].name.nativeName;
        /* for (let [key, value] in native) {
          setNativeName((prevState) => [...prevState, value.official]);
        } */
        const nArray = Object.values(native);
        let n = [];
        nArray.map((name) => {
          n.push(name.official);
        });
        setNativeName(n);

        const flag = response.data[0].flags.svg;
        const coa = response.data[0].coatOfArms.svg;
        setLatLong([e.latlng.lat, e.latlng.lng]);
        const info = {
          name: response.data[0].name.official,
          capital: response.data[0].capital[0],
          population: response.data[0].population,
          flag: flag,
          coa: coa,
        };
        setSelectedCountry(info);
      },
    });
  };

  return (
    <>
      <div className="fullContainer ">
        <Header
          setSelectedCountry={setSelectedCountry}
          setNativeName={setNativeName}
          countryCode={countryC}
        />
        <div className="app__map_info_container">
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
                data={country.features}
                onEachFeature={handleClick}
              />
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {selectedCountry && !latlong && (
                <Popup position={null}>
                  <div className="country_name p__oswald">
                    {selectedCountry.name}
                  </div>
                  <div className="popup_info_container p__roboto">
                    Native Names:
                    <div className="values">
                      {nativeName.map((name, i) => (
                        <Fragment key={i}>
                          {name}
                          {<br />}
                        </Fragment>
                      ))}
                    </div>
                  </div>
                  <div className="popup_info_container p__roboto">
                    Capital City:
                    <div className="values">{selectedCountry.capital}</div>
                  </div>
                  <div className="popup_info_container p__roboto">
                    Population:
                    <div className="values">{selectedCountry.population}</div>
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
              {selectedCountry && latlong && (
                <Popup position={[latlong[0], latlong[1]]}>
                  <div className="country_name p__oswald">
                    {selectedCountry.name}
                  </div>
                  <div className="popup_info_container p__roboto">
                    Native Names:
                    <div className="values">
                      {nativeName.map((name, i) => (
                        <Fragment key={i}>
                          {name}
                          {<br />}
                        </Fragment>
                      ))}
                    </div>
                  </div>
                  <div className="popup_info_container p__roboto">
                    Capital City:
                    <div className="values">{selectedCountry.capital}</div>
                  </div>
                  <div className="popup_info_container p__roboto">
                    Population:
                    <div className="values">{selectedCountry.population}</div>
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
      </div>
    </>
  );
}

export default MyMap;
