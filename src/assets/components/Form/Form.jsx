import React, { useState } from "react";
import "./Form.css";
import Datepicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa";

const Form = ({ toggle }) => {
  const [eventState, setEventState] = useState("Wedding");
  const [selectedDate, setDate] = useState(null);
  return (
    <section className="form-wrapper">
      <div className="form-container">
        <div className="form-contents">
          <h1 style={{ color: "#846330", fontSize: "24px" }}>
            Personal Information
          </h1>
          <h1>Name*</h1>
          <input className="input-form" type="text" />
        </div>
        <div className="form-contents">
          <h1>Email*</h1>
          <input className="input-form" type="text" />
        </div>
        <div className="form-contents">
          <h1>Phone Number*</h1>
          <input className="input-form" type="text" />
        </div>
        <h1
          style={{
            color: "#846330",
            fontSize: "24px",
            fontWeight: "400",
            padding: "10px",
          }}
        >
          Event Information
        </h1>
        <div className="form-contents shifts">
          <div className="estimated">
            <h1>Estimated Number of Guests*</h1>
            <input
              className="input-form"
              type="text"
              style={{ fontSize: "16px" }}
            />
          </div>
          <div className="event-type">
            <h1 style={{ padding: "9.5px" }}>Shift*</h1>
            <select
              className="event-comboBox"
              onChange={(e) => {
                const selectedEvent = e.target.value;
                setEventState(selectedEvent);
              }}
            >
              <option value="Morning">Morning</option>
              <option value="Evening">Evening</option>
              <option value="Whole Day">Whole Day</option>
            </select>
          </div>
        </div>
        <div className="form-contents datepicker-container">
          <div className="calendar-con">
            <div className="date-con">
              <h2>Select Date*</h2>
              <FaCalendarAlt className="calendar-icon" />
            </div>

            <div className="datepicker-content">
              <Datepicker
                selected={selectedDate}
                onChange={(date) => setDate(date)}
                className="custom-datepicker"
              />
            </div>
          </div>
          <div className="event-type">
            <h1>Select Event Type*</h1>
            <select
              className="event-comboBox"
              onChange={(e) => {
                const selectedEvent = e.target.value;
                setEventState(selectedEvent);
              }}
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
        </div>
        <div className="available-btn">
          <button className="available" onClick={toggle}>
            Check Availability
          </button>
        </div>
      </div>
    </section>
  );
};

export default Form;
