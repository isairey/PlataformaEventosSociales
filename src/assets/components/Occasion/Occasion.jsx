import React from "react";
import {
  FaCalendarAlt,
  FaFacebook,
  FaInstagram,
  FaTiktok,
} from "react-icons/fa";
import "./Occasion.css";
import { Link } from "react-router-dom";

const Occasion = () => {
  return (
    <section className="occasion-wrapper">
      <div className="occasion-container">
        <div className="occasion-left">
          <img src="/images/Wedding.png" alt="" />
        </div>
        <div className="occasion-right">
          <h1>WHERE EVERY OCCASION FEELS </h1>
          <h1 style={{ color: "#846330" }}>EXTRAORDINARY</h1>
          <p>
            Impeccable service, elegant ambiance, and unmatched attention to
            detail make every occasion truly special. Indulge in culinary
            excellence tailored to your tastes in a stunning event setting,
            accompanied by hassle-free, effortless parking.
          </p>
          {/* <Link to="/checkavailability">
            <button className="book-btn">
              <FaCalendarAlt
                style={{ fontSize: "20px", paddingRight: "8px" }}
              />{" "}
              Online Booking
            </button>
          </Link> */}

          {/* <h3>FOLLOW US</h3>
          <span>
            <FaFacebook
              style={{
                fontSize: "24px",
                marginRight: "10px",
                marginTop: "10px",
              }}
            />{" "}
            <FaInstagram
              style={{
                fontSize: "24px",
                marginRight: "10px",
                marginTop: "10px",
              }}
            />{" "}
          </span> */}
        </div>
      </div>
    </section>
  );
};

export default Occasion;
