import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import "./header.css";
import { IoSearch, IoCloseCircleOutline } from "react-icons/io5";
import { AnimatePresence, motion } from "framer-motion";
import { useClickOutside } from "react-click-outside-hook";
import { ClipLoader } from "react-spinners";
import useDebounce from "../hooks/debounceHook";
import axios from "axios";

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
  padding: 1em;
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

function Header({ setSelectedCountry }) {
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
    if (isClickedOutside) collapseContainer();
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

  useEffect(() => {
    countries.map((country) => {
      console.log(country.name.common);
    });
  }, [countries]);

  useDebounce(search, 500, searchCountry);

  return (
    <>
      <div className="app__header ">
        {/* <div className="app__header_section">
          <p className="p__roboto">
            PLACEHOLDER TEXT, PUT STUFF HERE IDK WHAT BUT YEAH
          </p>
        </div> */}
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
                  transition={{ duration: 0.2 }}
                  onClick={collapseContainer}
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
          </SearchResults>
        </SearchBarContainer>
      </div>
    </>
  );
}

export default Header;
