import { motion } from "framer-motion";
import React, { useState } from "react";
import styled from "styled-components";

const CountryContainer = styled(motion.div)`
  height: 5em;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding: 1rem;
  cursor: pointer;
  :hover {
    background: rgb(132, 142, 204);
    background: radial-gradient(
      circle,
      rgba(132, 142, 204, 1) 0%,
      rgba(71, 155, 255, 1) 100%
    );
  }
`;

const CountryIcon = styled.img`
  height: 100%;
  width: 80px;
  ,
  img {
    border-radius: 5px;
    border: solid 0.1px rgba(0, 0, 0, 0.2);
  }
`;

const CountryName = styled.span`
  display: flex;
  align-items: center;
  height: 100%;
  font-family: var(--font-alt);
  font-weight: 600;
  font-size: 25px;
`;

function CountrySelect({ name, flag, setPopup }) {
  const handleClick = () => {
    setPopup(name);
  };

  return (
    <CountryContainer onClick={handleClick}>
      <CountryName>{name}</CountryName>
      <CountryIcon src={flag} alt="country_flag" />
    </CountryContainer>
  );
}

export default CountrySelect;
