import "./App.css";
import { useState } from "react";
import MyMap from "./component/MyMap";
import Header from "./component/Header";
import Modal from "./component/Modal";

const App = () => {
  const [openPopup, setOpenPopup] = useState(true);

  /*  const handleClose = () => {
    setOpenPopup(false);
    localStorage.setItem("item", "popup");
  };

  if (localStorage.getItem("item") !== "popup") {
    return <Modal open={openPopup} handleClose={handleClose} />;
  } */

  return (
    <>
      <MyMap />
    </>
  );
};

export default App;
