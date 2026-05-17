import React from "react";
import "./Nav.css";
import { Link } from "react-router-dom";

const Nav = () => {
  return (
    <section className="nav-wrapper">
      <nav className="nav-container">
        <Link to="/home">
          <img src="/images/logo.png" alt="" />
        </Link>
        {/* <div className="line"></div> */}
        <div className="bookline"></div>
        <h1
          style={{
            fontWeight: "600px",
            fontSize: "40px",
            textAlign: "center",
            color: "#846330",
            textDecoration: "underline",
          }}
        >
          Book a Venue
        </h1>
      </nav>
    </section>
  );
};

export default Nav;
