import React, { useState } from "react";
import { GiCancel } from "react-icons/gi";
import "./modal.css";

function Modal({ open, handleClose }) {
  if (!open) return null;

  return (
    <div className="bg__img">
      <div className="overlay">
        <div className="popup_container section__padding">
          <GiCancel className="container_close" onClick={handleClose} />
          <div className="popup_content p__roboto">
            <p className="p1">Country Info Map V 0.2</p>
            <ul>
              <li> Interactable map </li>
              <li> Clicking a country shows its available information </li>
              <li> Search bar functionality </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Modal;
