import React, { useState } from "react";
import "./header.css";

function Header() {
  const [search, setSearch] = useState("");

  return (
    <div className="app__header section__padding flex__center">
      <div className="app__header_section">
        <p className="p__roboto">Hello this is a stupid map thing i'm making</p>
        <input
          type="text"
          placeholder="country"
          className="searchbar"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
    </div>
  );
}

export default Header;
