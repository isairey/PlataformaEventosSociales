import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa";
import "./CheckAvailability.css";
import { useSnackbar } from "notistack";
import axios from "axios";

const CheckAvailability = () => {
  const [eventState, setEventState] = useState("Single-Day");
  const [singleDayDate, setSingleDayDate] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [eventType, setEventType] = useState("Wedding");
  const [eventData, setEventData] = useState({});
  const [allEventData, setAllEventData] = useState({});
  const [estimatedGuests, setEstimatedGuests] = useState("");
  const [days, setDays] = useState("Single-Day");
  const [dayShift, setShifts] = useState("Morning");
  const [bookDate, setBookDate] = useState("");
  const [startDatedb, setStartDatedb] = useState("");
  const [endDatedb, setEndDatedb] = useState("");
  const [loading, setLoading] = useState(false);
  const [guestsExceedLimit, setGuestsExceedLimit] = useState(false);
  const [allFieldsEntered, setAllFieldsEntered] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    fetchEventData();
  }, []);

  useEffect(() => {
    const areAllFieldsEntered =
      estimatedGuests !== "" &&
      eventType !== "" &&
      (eventState === "Single-Day"
        ? singleDayDate !== null
        : startDate !== null && endDate !== null);

    setAllFieldsEntered(areAllFieldsEntered);
  }, [
    estimatedGuests,
    eventType,
    eventState,
    singleDayDate,
    startDate,
    endDate,
  ]);

  const fetchEventData = () => {
    setLoading(true);
    // Fetch last data
    axios
      .get("http://localhost:9000/books?_sort=createdAt&_order=desc&_limit=1")
      .then((response) => {
        setLoading(false);
        const latestData = response.data.data.pop();
        setEventData(latestData);
        enqueueSnackbar("Latest event data retrieved successfully", {
          variant: "success",
        });
      })
      .catch((error) => {
        setLoading(false);
        enqueueSnackbar("Error retrieving latest event data", {
          variant: "error",
        });
        console.log(error);
      });

    // Fetch all data
    axios
      .get("http://localhost:9000/books")
      .then((response) => {
        setLoading(false);
        const allData = response.data;
        setAllEventData(allData);
        enqueueSnackbar("All event data retrieved successfully", {
          variant: "success",
        });
      })
      .catch((error) => {
        setLoading(false);
        enqueueSnackbar("Error retrieving all event data", {
          variant: "error",
        });
        console.log(error);
      });
  };

  const handleSaveBook = () => {
    const estimatedGuestsNumber = parseInt(estimatedGuests);
    if (estimatedGuestsNumber > 1250) {
      setGuestsExceedLimit(true);
      return;
    }

    // Check if any required field is empty
    if (!allFieldsEntered) {
      enqueueSnackbar("Input fields are empty", { variant: "error" });
      return;
    }

    // **Redirect only if both conditions are met**
    if (!guestsExceedLimit && allFieldsEntered) {
      const data = {
        estimatedGuests,
        eventType,
        days,
        dayShift,
        bookDate,
        startDate,
        endDate,
      };
      setLoading(true);
      axios
        .post("http://localhost:9000/books", data)
        .then(() => {
          fetchEventData();
          setLoading(false);
          enqueueSnackbar("Book Created successfully", { variant: "success" });
        })
        .catch((error) => {
          setLoading(false);
          enqueueSnackbar("Error", { variant: "error" });
          console.log(error);
        });
      navigate("/bookvenue");
    }
  };

  return (
    <section className="check-wrapper">
      <div className="check-container">
        <div className="left-container">
          {/* <div className="check-content">
            <h1>Want to Book a Venue?</h1>
            <span>
              Discovering the perfect venue for your special occasion has never
              been easier! With our convenient online platform, you can
              effortlessly browse through a variety of options, check
              availability for your desired date, and secure your booking with
              ease. From intimate gatherings to grand celebrations, we have a
              venue to suit every need and budget. Say goodbye to the stress of
              venue hunting and hello to seamless event planning!
            </span>
          </div> */}
        </div>
        <div className="check-rightcontainer">
          <form>
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
              <input
                className="inputfield"
                type="text"
                value={estimatedGuests}
                onChange={(e) => {
                  setEstimatedGuests(e.target.value);
                  setGuestsExceedLimit(false); // Reset guests exceed limit state
                }}
              />
              {guestsExceedLimit && (
                <p style={{ color: "red" }}>Maximum limit for guests is 1250</p>
              )}
              <h2>Days</h2>
              <select
                className="event-comboBox"
                onChange={(e) => {
                  const selectedEvent = e.target.value;
                  setEventState(selectedEvent);
                  setDays(selectedEvent);
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
                    <select
                      className="event-comboBox"
                      value={dayShift}
                      onChange={(e) => setShifts(e.target.value)}
                    >
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
                      <DatePicker
                        selected={singleDayDate}
                        value={bookDate}
                        onChange={(date) => {
                          setSingleDayDate(date);
                          setBookDate(date);
                        }}
                        className="custom-datepicker"
                        minDate={new Date()} // Prevent selection of past dates
                      />
                    </div>
                  </div>
                </div>
              )}

              {eventState === "Multiple-Days" && (
                <div className="Mul-days">
                  <div>
                    <h2 style={{ fontSize: "15px" }}>Start Date</h2>
                    <DatePicker
                      selected={startDate}
                      value={startDatedb}
                      onChange={(date) => {
                        setStartDate(date);
                        setStartDatedb(date);
                      }}
                      className="custom-datepicker small-datepicker"
                      minDate={new Date()} // Prevent selection of past dates
                    />
                  </div>
                  <div>
                    <h2 style={{ fontSize: "15px" }}>End Date</h2>
                    <DatePicker
                      selected={endDate}
                      value={endDatedb}
                      onChange={(date) => {
                        setEndDate(date);
                        setEndDatedb(date);
                      }}
                      className="custom-datepicker small-datepicker"
                      minDate={startDate || new Date()} // Prevent selection of past dates and ensure end date is not before start date
                    />
                  </div>
                </div>
              )}
              <div className="event-type">
                <h2>Select Event Type</h2>
                <select
                  className="event-comboBox"
                  value={eventType}
                  onChange={(e) => {
                    const selectedEventType = e.target.value;
                    setEventType(selectedEventType);
                  }}
                >
                  <option value="Wedding">Wedding</option>
                  <option value="Anniversary">Anniversary</option>
                  <option value="Engagement">Engagement</option>
                  <option value="Bartamanda">Bartamanda</option>
                  <option value="Reception">Reception</option>
                  <option value="Birthday">Birthday</option>
                  <option value="Teej Event">Teej Event</option>
                  <option value="Social Event">Social Event</option>
                  <option value="Corporate Event">Corporate Event</option>
                </select>
              </div>
              {!allFieldsEntered && (
                <p style={{ color: "red" }}>
                  Note: All input fields should be entered.
                </p>
              )}
              <button
                className="check-button"
                onClick={handleSaveBook}
                disabled={guestsExceedLimit || !allFieldsEntered}
              >
                CHECK AVAILABILITY
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default CheckAvailability;
