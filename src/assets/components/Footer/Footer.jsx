import React from "react";
import "./Footer.css";
import { FaCalendarAlt, FaFacebook, FaInstagram } from "react-icons/fa";

export const Footer = () => {
  return (
    <section className="footer-wrapper">
      <div className="footer-container">
        <div className="footer-content">
          <h1>Hamro Banquet</h1>
          <p>Chabahil, Kathmandu</p>
          <p>
            Indulge in unforgettable moments at our banquet, where elegance
            meets excellence. Experience impeccable service, exquisite cuisine,
            and a captivating ambiance, ensuring every occasion becomes a
            cherished memory.
          </p>
          {/* <FaFacebook style={{ fontSize: "20px", padding: "10px" }} />
          <FaInstagram style={{ fontSize: "20px", padding: "10px" }} /> */}
        </div>
        <div className="footer-bottom">
          <p style={{ fontSize: "14px" }}>Copyright @2024</p>
        </div>
      </div>
    </section>
  );
};
