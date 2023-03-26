import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import "./header.css";
import { IoSearch, IoCloseCircleOutline } from "react-icons/io5";
import { AnimatePresence, motion } from "framer-motion";
import { useClickOutside } from "react-click-outside-hook";
import { ClipLoader } from "react-spinners";
import useDebounce from "../hooks/debounceHook";
import axios from "axios";
import CountrySelect from "./CountrySelect";

const SearchBarContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  width: 550px;
  height: 4em;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0px 2px 12px 3px rgba(0, 0, 0, 0.5);
  overflow: hidden;
`;

const SearchInputContainer = styled.div`
  width: 100%;
  height: 4.2em;
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;
  padding: 2px 15px;
`;

const SearchInput = styled.input`
  width: 100%;
  height: 100%;
  margin: 1em 0;
  outline: none;
  border: none;
  font-size: 25px;
  color: #12112e;
  border-radius: 5px;
  font-weight: bold;
  font-family: var(--font-alt);
  background-color: transparent;
  color: var(--color-black);
  &:focus {
    outline: none;
    &::placeholder {
      opacity: 0;
    }
  }

  &::placeholder {
    font-size: 20px;
    color: var(--color-grey);
    transition: all 250ms ease-in-out;
  }
`;

const SearchIcon = styled.span`
  color: var(--color-grey);
  font-size: 30px;
  margin-right: 20px;
  margin-top: 6px;
  vartical-align: middle;
`;

const CloseIcon = styled(motion.span)`
  color: var(--color-gray);
  font-size: 30px;
  vartical-align: middle;
  margin-top: 6px;
  transition: all 200ms ease-in-out;
  cursor: pointer;
  &:hover {
    color: var(--color-grey);
  }
`;

const SearchResults = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const LineSeperator = styled.span`
  display: flex;
  min-width: 100%;
  min-height: 1px;
  background-color: var(--color-grey);
`;

const LoadingWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const containerVariants = {
  expanded: {
    height: "20em",
  },
  collapsed: {
    height: "4em",
  },
};

function Header({ setSelectedCountry, setNativeName }) {
  const [isExpanded, setExpanded] = useState(false);
  const [ref, isClickedOutside] = useClickOutside(false);
  const [search, setSearch] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [countries, setCountries] = useState([]);
  const inputRef = useRef();

  const exapndContainer = () => {
    setExpanded(true);
  };

  const collapseContainer = () => {
    setExpanded(false);
    setLoading(false);
    setSearch("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  useEffect(() => {
    if (isClickedOutside) {
      collapseContainer();
      setCountries([]);
    }
  }, [isClickedOutside]);

  const perpareSearchQuery = (query) => {
    const url = `https://restcountries.com/v3.1/name/${query}`;

    return encodeURI(url);
  };

  const searchCountry = async () => {
    if (!search || search.trim() === " ") {
      return;
    }
    setCountries([]);
    setLoading(true);
    const url = perpareSearchQuery(search);

    const response = await axios.get(url).catch((err) => {
      console.log(err);
    });

    if (response) {
      setCountries(response.data);
    }

    setLoading(false);
  };

  useDebounce(search, 500, searchCountry);

  const setPopup = async (country) => {
    const url = perpareSearchQuery(country);
    const response = await axios.get(url);

    if (response) {
      const native = response.data[0].name.nativeName;
      const nArray = Object.values(native);
      let n = [];
      nArray.map((name) => {
        n.push(name.official);
      });
      setNativeName(n);
      /* const commonName = Object.values(nativeName)[0].official; */
      const flag = response.data[0].flags.svg;
      const coa = response.data[0].coatOfArms.svg;
      const info = {
        name: response.data[0].name.official,
        capital: response.data[0].capital[0],
        population: response.data[0].population,
        flag: flag,
        coa: coa,
      };
      setSelectedCountry(info);
      collapseContainer();
      setCountries([]);
    }
  };

  return (
    <>
      <div className="app__header ">
        <SearchBarContainer
          animate={isExpanded ? "expanded" : "collapsed"}
          variants={containerVariants}
          ref={ref}
        >
          <SearchInputContainer>
            <SearchIcon>
              <IoSearch />
            </SearchIcon>
            <SearchInput
              placeholder="Search country"
              onFocus={exapndContainer}
              ref={inputRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <AnimatePresence>
              {isExpanded && (
                <CloseIcon
                  key="closeIcon"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  onClick={() => {
                    collapseContainer();
                    setCountries([]);
                  }}
                >
                  <IoCloseCircleOutline />
                </CloseIcon>
              )}
            </AnimatePresence>
          </SearchInputContainer>
          <LineSeperator />
          <SearchResults>
            {isLoading && (
              <LoadingWrapper>
                <ClipLoader loading color="#5c97f1" size={50} />
              </LoadingWrapper>
            )}
            {countries && !isLoading && (
              <div>
                {countries.map((country, index) => (
                  <CountrySelect
                    key={index}
                    name={country.name.common}
                    flag={country.flags.svg}
                    setPopup={setPopup}
                  />
                ))}
              </div>
            )}
          </SearchResults>
        </SearchBarContainer>
      </div>
    </>
  );
}

export default Header;
