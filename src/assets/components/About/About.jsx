import React from "react";
import { FaPhoneAlt } from "react-icons/fa";
import "./About.css";

const About = () => {
  return (
    <section className="about-wrapper">
      <div className="about-linecontainer">
        <div className="about-line"></div>
      </div>
      <div className="about-container">
        <div className="about-left">
          <img
            src="/images/Window.jpg"
            alt=""
            style={{ padding: "40px", height: "40vh" }}
          />
          <img src="/images/Dinner.jpg" alt="" style={{ height: "40vh" }} />
        </div>
        <div className="about-right">
          <h1 style={{ fontWeight: "600", color: "#846330" }}>
            About Hamro Banquet
          </h1>
          <span style={{ color: "#846330" }}>
            Hamro Banquet and Event Management is a wholesome complete catering
            service and event management business company. After our various
            catering and banquet business work since 1998 we are today
            established as a successful banquet company in Nepal with young,
            imaginative, keen and dynamic professionals with a sparkling stream
            of ideas having vast experience in the field of catering services
            and events. . . . .
          </span>
          <div className="about-bottom">
            <div className="experience">
              <h1 style={{ padding: "10px" }}>20+</h1>
              <p style={{ fontSize: "18px" }}>
                Years <br />
                of Experience
              </p>
            </div>
            <div className="contact">
              <FaPhoneAlt style={{ fontSize: "20px", padding: "18px" }} />
              <p style={{ fontSize: "18px" }}>
                Call Us <br />
                <b style={{ fontWeight: "500" }}>+977 01 5499821</b>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
