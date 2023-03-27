import axios from "axios";
import React, { useState, Fragment } from "react";
import { MapContainer, TileLayer, GeoJSON, Popup } from "react-leaflet";
import styled from "styled-components";
import country from "../data/countries.json";
import Header from "./Header";
import { FaCopyright, FaLinkedin, FaGithub } from "react-icons/fa";

import "./map.css";

const CopyrightContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 1;
  width: 300px;
  height: 2rem;
  margin-left: 1rem;
  margin-bottom: 1rem;
  background: rgb(167, 176, 235);
  background: radial-gradient(
    circle,
    rgb(167, 176, 235) 0%,
    rgb(125, 186, 255) 100%
  );
  border-radius: 5px;
  box-shadow: 0px 2px 12px 3px rgba(0, 0, 0, 0.5);
  overflow: hidden;
  font-family: var(--font-base);
  align-items: center;
  padding: 0 1rem;
  opacity: 0.2;
  transition: 0.5s ease-in;
  &:hover {
    opacity: 1;
  }
`;

const CopyrightText = styled.span`
  width: 60%;
  display: flex;
  justify-content: space-between;
`;

const CopyrightIcons = styled.span`
  
  width: 100%
  cursor: pointer;
  vertical-align: middle;
  horizontal-align: end;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 0.35rem;
  & *{
    color: #000;
    &:hover{
      color: #fff;
    }
    & *{
      cursor: pointer;
    }
    
  }
`;

function MyMap() {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [countryC, setCountryCode] = useState(null);
  const [nativeName, setNativeName] = useState([]);
  const [latlong, setLatLong] = useState([0, 0]);
  let lat = 36.753769;
  let long = 3.058756;

  function formatNumber(num) {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(2) + "B";
    } else if (num >= 1000000) {
      return (num / 1000000).toFixed(2) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(2) + "k";
    } else {
      return num;
    }
  }

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
        const pop = formatNumber(response.data[0].population);
        setLatLong([e.latlng.lat, e.latlng.lng]);
        const info = {
          name: response.data[0].name.official,
          capital: response.data[0].capital[0],
          population: pop,
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
        <CopyrightContainer>
          <CopyrightText>
            <FaCopyright style={{ marginTop: "0.1rem" }} />
            2023 chahine boudemagh
          </CopyrightText>
          <CopyrightIcons>
            <a
              href="https://www.linkedin.com/in/chahine-boudemagh-1b1b761b8/"
              target="_blank"
            >
              <FaLinkedin style={{ marginRight: "0.5rem" }} />
            </a>
            <a href="https://github.com/chahineBoude" target="_blank">
              <FaGithub />
            </a>
          </CopyrightIcons>
        </CopyrightContainer>
      </div>
    </>
  );
}

export default MyMap;
