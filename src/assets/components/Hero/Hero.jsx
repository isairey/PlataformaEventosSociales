import React, { useState, useEffect } from "react";
import { FiMapPin } from "react-icons/fi";
import { Typewriter } from "react-simple-typewriter";
import { Link } from "react-router-dom";
import Datepicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa";
import CheckAvailability from "../CheckAvailability/CheckAvailability";

import "./Hero.css";

const Hero = () => {
  const [eventState, setEventState] = useState("Single-Day");
  const [singleDayDate, setSingleDayDate] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [eventType, setEventType] = useState("Wedding"); // New state for event type

  useEffect(() => {
    setEventState("Single-Day");
  }, []);

  return (
    <section className="hero-wrapper">
      <div className="hero-container">
        {/* left-side */}
        <div className="hero-left">
          <div className="hero-head2">
            <h2>Hamro Banquet</h2>
            <span>
              <FiMapPin className="location-icon" />
            </span>
            <span> Chabahil, Kathmandu</span>
          </div>
          <div className="hero-content">
            <h1>
              The Perfect Event <br />
              Venue for
              <span style={{ color: "#ffbf00" }}>
                <Typewriter
                  words={[
                    " Wedding.",
                    " Engagement.",
                    " Anniversary.",
                    " Bartamanda.",
                    " Reception.",
                  ]}
                  loop={0}
                  Cursor
                  typeSpeed={100}
                  deleteSpeed={50}
                  delaySpeed={1000}
                />
              </span>
            </h1>
            <p>
              If you are looking for a perfect event experience with memories to
              cherish you are at the right place. Let’s plan a grand event for
              you.
            </p>
          </div>
        </div>

        {/* right-side */}
        <div className="hero-right">
          <CheckAvailability />
          {/* <div className="hero-rightcontainer">
            <form action="">
              <h1
                style={{
                  color: "#846330",
                  fontSize: "24px",
                  fontWeight: "600",
                  padding: "10px 0px",
                }}
              >
                Event Information
              </h1>
              <div className="form-contents">
                <h2>Estimated Number of Guests</h2>
                <input className="inputfield" type="text" />
                <h2>Days</h2>
                <select
                  className="event-comboBox"
                  onChange={(e) => {
                    const selectedEvent = e.target.value;
                    setEventState(selectedEvent);
                  }}
                  value={eventState}
                >
                  <option value="Single-Day">Single Day</option>
                  <option value="Multiple-Days">Multiple Days</option>
                </select>

                {eventState === "Single-Day" && (
                  <div>
                    <div>
                      <h2 style={{ fontSize: "15px" }}>Shift</h2>
                      <select className="event-comboBox">
                        <option value="Morning">Morning</option>
                        <option value="Evening">Evening</option>
                        <option value="Whole Day">Whole Day</option>
                      </select>
                    </div>
                    <div>
                      <div className="calendar-icondiv">
                        <h2 style={{ fontSize: "15px" }}>Select Date</h2>
                        <FaCalendarAlt className="calendar-icon" />
                      </div>
                      <div className="datepicker-content">
                        <Datepicker
                          selected={singleDayDate}
                          onChange={(date) => setSingleDayDate(date)}
                          className="custom-datepicker"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {eventState === "Multiple-Days" && (
                  <div className="Mul-days">
                    <div>
                      <h2 style={{ fontSize: "15px" }}>Start Date</h2>
                      <Datepicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        className="custom-datepicker small-datepicker"
                      />
                    </div>
                    <div>
                      <h2 style={{ fontSize: "15px" }}>End Date</h2>
                      <Datepicker
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        className="custom-datepicker small-datepicker"
                      />
                    </div>
                  </div>
                )}
                <div className="event-type">
                  <h2>Select Event Type</h2>
                  <select
                    className="event-comboBox"
                    onChange={(e) => {
                      const selectedEventType = e.target.value;
                      setEventType(selectedEventType); // Update eventType state
                    }}
                    value={eventType} // Set value to eventType
                  >
                    <option value="Wedding">Wedding</option>
                    <option value="Aniversary">Anniversary</option>
                    <option value="Engagement">Engagement</option>
                    <option value="Bartamanda">Bartamanda</option>
                    <option value="Reception">Reception</option>
                    <option value="Birthday">Birthday</option>
                    <option value="Teej Event">Teej Event</option>
                    <option value="Social Event">Social Event</option>
                    <option value="Corporate Event">Corporate Event</option>
                  </select>
                </div>
                <Link to="/bookvenue">
                  {" "}
                  <button className="check-button">Check Availability</button>
                </Link>
              </div>
            </form>
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default Hero;
