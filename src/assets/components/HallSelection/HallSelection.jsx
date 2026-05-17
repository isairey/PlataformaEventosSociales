import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSnackbar } from "notistack";
import "./HallSelection.css";
import HallKathmandu from "../HallKathmandu/HallKathmandu";
import HallBhaktapur from "../HallBhaktapur/HallBhaktapur";
import HallPatan from "../HallPatan/HallPatan";
import HallKritipur from "../HallKritipur/HallKritipur";
import { RiHomeFill } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";

const HallSelection = ({ onSelectClick, onImageClick }) => {
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [selectedHall, setSelectedHall] = useState("Hall Kathmandu");
  const [hallData, setHallData] = useState([]);
  const [showAllHalls, setShowAllHalls] = useState(false);
  const [showAllText, setShowAllText] = useState("Show All Halls"); // Define showAllText state
  let hallNameSelected;
  let hallprice;

  const fetchHallData = async () => {
    try {
      setLoading(true);
      const hallsResponse = await axios.get(
        "http://localhost:9000/halls?_sort=createdAt&_order=desc"
      );

      const halls = hallsResponse.data.data;

      // Filter halls that are present in the database and have a name
      const hallsInDatabase = halls.filter((hall) => hall.name);

      const hallsWithBookings = await Promise.all(
        hallsInDatabase.map(async (hall) => {
          try {
            console.log("Fetching bookings for hall:", hall.name);
            const bookingsResponse = await axios.get(
              `http://localhost:9000/books?hallName=${hall.name}&eventStatus=false`
            );
            const bookings = bookingsResponse.data.data;
            console.log("Bookings for hall:", hall.name, bookings);
            return { ...hall, bookings };
          } catch (error) {
            console.error(
              "Error fetching bookings for hall:",
              hall.name,
              error
            );
            return hall;
          }
        })
      );

      setHallData(hallsWithBookings);
      setLoading(false);
      enqueueSnackbar("Hall data retrieved successfully", {
        variant: "success",
      });
    } catch (error) {
      setLoading(false);
      enqueueSnackbar("Error retrieving hall data", { variant: "error" });
      console.error("Error fetching hall data:", error);
    }
  };

  const filteredHall = () => {
    setLoading(true);
    axios
      .get("http://localhost:9000/books?_sort=createdAt&_order=desc&_limit=1")
      .then((response) => {
        setLoading(false);
        const latestData = response.data.data.pop();
        const estimatedGuests = latestData.estimatedGuests;

        // Set showAllHalls state variable based on estimatedGuests value
        setShowAllHalls(estimatedGuests <= 600);
        setShowAllText(showAllHalls ? "Show Less" : "Show All Halls"); // Update showAllText
        enqueueSnackbar("Latest data retrieved. Check console.", {
          variant: "info",
        });
      });
  };

  const handleSaveBook = () => {
    setLoading(true);
    axios
      .get("http://localhost:9000/books?_sort=createdAt&_order=desc&_limit=1")
      .then((response) => {
        setLoading(false);
        const latestData = response.data.data.pop();
        const latestId = latestData._id;
        const userdays = latestData.days;
        const latestStartDate = latestData.startDate;
        const latestEndDate = latestData.endDate;
        const estimatedguests = latestData.estimatedGuests;
        enqueueSnackbar("Latest data retrieved. Check console.", {
          variant: "info",
        });

        // Determine the value of hallprice based on userdays
        if (userdays === "Single-Day") {
          hallprice = hallData.find(
            (hall) => hall.name === hallNameSelected
          ).priceShift;
        } else {
          hallprice =
            hallData.find((hall) => hall.name === hallNameSelected).priceDay *
            getNumberOfDays(latestStartDate, latestEndDate);
        }

        updateDocument(latestId);
      })
      .catch((error) => {
        setLoading(false);
        enqueueSnackbar("Error", { variant: "error" });
        console.log(error);
      });
  };

  const updateDocument = (id) => {
    const data = {
      hallName: hallNameSelected,
      price: hallprice,
    };
    axios
      .put(`http://localhost:9000/books/${id}`, data)
      .then(() => {
        enqueueSnackbar("Document updated successfully", {
          variant: "success",
        });
      })
      .catch((error) => {
        enqueueSnackbar("Error updating document", { variant: "error" });
        console.log(error);
      });
  };

  const getNumberOfDays = (startDate, endDate) => {
    const oneDay = 24 * 60 * 60 * 1000;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffDays = Math.round(Math.abs((start - end) / oneDay)) + 1;
    return diffDays;
  };

  useEffect(() => {
    fetchHallData();
    filteredHall();
  }, []);

  return (
    <section className="hall-wrapper">
      <div className="right-side">
        <Link to="/home" style={{ textDecoration: "none" }}>
          <button className="home-btn">
            <RiHomeFill /> Home
          </button>
        </Link>

        <h1
          style={{
            paddingLeft: "60px",
            paddingTop: "20px",
            paddingBottom: "40px",
            color: "#846330",
            fontWeight: "500",
            fontSize: "25px",
          }}
        >
          Hall Selection
        </h1>
        <div className="hall-container">
          {/* Display "Show All" button only if not all halls are shown */}
          {!showAllHalls && (
            <h1
              onClick={() => setShowAllHalls(!showAllHalls)}
              style={{
                cursor: "pointer",
                color: "black",
                fontWeight: "500",
                fontSize: "18px",
                textDecoration: "underline",
                paddingBottom: "10px",
              }}
            >
              {showAllText}
            </h1>
          )}
          {hallData.map((hall, index) => {
            if (
              showAllHalls ||
              (hall.name !== "Hall Patan" && hall.name !== "Hall Kritipur")
            ) {
              return (
                <div
                  key={index}
                  className={`halls hall-${hall.name
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                >
                  <img
                    src={`/images/${hall.name}.jpg`}
                    alt={hall.name}
                    className="hallimg"
                  />
                  <div className="hallDes">
                    <h1>{hall.name}</h1>
                    <p>
                      Capacity: {hall.minCapacity} - {hall.maxCapacity}
                      <br />
                      Price per Shift: {hall.priceShift}
                      <br />
                      Price per Day: {hall.priceDay}
                      <br />
                      {hall.bookings &&
                        hall.bookings
                          .filter(
                            (booking) =>
                              booking.hallName === hall.name &&
                              !booking.eventStatus
                          )
                          .slice(0, 3) // Only show up to 3 bookings
                          .map((booking, idx) => {
                            return (
                              <span key={idx} style={{ color: "red" }}>
                                Hall will be unavailable for the date:{" "}
                                {booking.days === "Single-Day" ? (
                                  new Date(
                                    booking.bookDate
                                  ).toLocaleDateString()
                                ) : (
                                  <>
                                    <br />
                                    {new Date(
                                      booking.startDate
                                    ).toLocaleDateString()}{" "}
                                    to{" "}
                                    {new Date(
                                      booking.endDate
                                    ).toLocaleDateString()}
                                  </>
                                )}
                                <br />
                              </span>
                            );
                          })}
                    </p>
                    <div className="buttons">
                      <button
                        className="primarybtn"
                        onClick={() => {
                          hallNameSelected = hall.name;
                          handleSaveBook();
                          onSelectClick();
                        }}
                      >
                        Select
                      </button>
                      <button
                        className="secondarybtn"
                        onClick={() => setSelectedHall(hall.name)}
                      >
                        View Hall
                      </button>
                    </div>
                  </div>
                </div>
              );
            } else {
              return null;
            }
          })}
        </div>
      </div>
      <div className="left-side">
        <div className="hall-kathmandu">
          {selectedHall === "Hall Kathmandu" && <HallKathmandu />}
          {selectedHall === "Hall Bhaktapur" && <HallBhaktapur />}
          {selectedHall === "Hall Patan" && <HallPatan />}
          {selectedHall === "Hall Kritipur" && <HallKritipur />}
        </div>
      </div>
    </section>
  );
};

export default HallSelection;
