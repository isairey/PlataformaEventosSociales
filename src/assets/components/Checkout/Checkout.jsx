import React, { useState, useEffect } from "react";
import "./Checkout.css";
import { useSnackbar } from "notistack";
import axios from "axios";
import { Link } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";

const Checkout = ({ onBack }) => {
  const [loading, setLoading] = useState(false);
  const [eventData, setEventData] = useState({});
  const { enqueueSnackbar } = useSnackbar();
  const [showModal, setShowModal] = useState(false);
  const [buffetData, setBuffetData] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [hallData, setHallData] = useState([]);
  const [latestId, setLatestId] = useState(null);
  let hallprice;

  useEffect(() => {
    fetchEventData();
  }, []);

  const fetchEventData = () => {
    setLoading(true);
    axios
      .get("http://localhost:9000/books?_sort=createdAt&_order=desc&_limit=1")
      .then((response) => {
        setLoading(false);
        const latestData = response.data.data.pop(); // Get the last element of the data array
        setEventData(latestData);
        setLatestId(latestData._id);
        enqueueSnackbar("Event data retrieved successfully", {
          variant: "success",
        });
      })
      .catch((error) => {
        setLoading(false);
        enqueueSnackbar("Error retrieving event data", { variant: "error" });
        console.log(error);
      });
  };

  const updateDocument = (id) => {
    const data = {
      name,
      email,
      phoneNo,
      checkedOut: true,
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

  const handleCheckout = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const fetchHallData = async () => {
    try {
      setLoading(true);
      const hallsResponse = await axios.get(
        "http://localhost:9000/halls?_sort=createdAt&_order=desc"
      );

      const halls = hallsResponse.data.data;

      const hallsInDatabase = halls.filter((hall) => hall.name);

      const hallsWithBookings = await Promise.all(
        hallsInDatabase.map(async (hall) => {
          try {
            console.log("Fetching bookings for hall:", hall.name);
            const bookingsResponse = await axios.get(
              `http://localhost:9000/books?hallName=${hall.name}&eventStatus=false`
            );
            const bookings = bookingsResponse.data.data;
            const hallPriceShift = hall.priceShift;
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

  const handleSaveBook = () => {
    setLoading(true);
    axios
      .get("http://localhost:9000/books?_sort=createdAt&_order=desc&_limit=1")
      .then((response) => {
        setLoading(false);
        const latestData = response.data.data.pop();
        const latestId = latestData._id;
        const userdays = latestData.days;
        const hallNamelatest = latestData.hallName;
        const latestStartDate = latestData.startDate;
        const latestEndDate = latestData.endDate;
        console.log(userdays);
        enqueueSnackbar("Latest data retrieved. Check console.", {
          variant: "info",
        });

        if (userdays === "Single-Day") {
          hallprice = hallData.find(
            (hall) => hall.name === hallNamelatest
          ).priceShift;
        } else {
          hallprice =
            hallData.find((hall) => hall.name === hallNamelatest).priceDay *
            getNumberOfDays(latestStartDate, latestEndDate);
        }

        updateHallDocument(latestId, hallNamelatest);
      })
      .catch((error) => {
        setLoading(false);
        enqueueSnackbar("Error", { variant: "error" });
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

  const updateHallDocument = (id, hallname) => {
    const data = {
      hallName: hallname,
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

  useEffect(() => {
    fetchHallData();
  }, []);

  return (
    <section className="checkout-wrapper">
      <button
        style={{ fontSize: "20px" }}
        className="backbtnchekout"
        onClick={() => {
          onBack();
          handleSaveBook();
        }}
      >
        <IoMdArrowRoundBack /> Back
      </button>
      <div className="checkout-container">
        <h1
          style={{ color: "#846330", fontWeight: "500", marginBottom: "30px" }}
        >
          Hall Selection / Buffect Selection / Book Venue
        </h1>
        <div className="personalinfo">
          <div className="form-container">
            <form action="" className="personalinfoForm">
              <h3 className="inputh3">Name</h3>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <h3 className="inputh3">Email</h3>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <h3 className="inputh3">Phone Number</h3>
              <input
                type="text"
                value={phoneNo}
                onChange={(e) => setPhoneNo(e.target.value)}
              />
            </form>
            <p style={{ color: "red", marginTop: "20px" }}>
              Note: All input fields are mandatory
            </p>
            <br />
          </div>
          <div className="eventinfo">
            <p>
              <b style={{ fontWeight: "400", color: "#846330" }}>Event Type:</b>{" "}
              {eventData.eventType}
            </p>
            <p>
              <b style={{ fontWeight: "400", color: "#846330" }}>
                Function Days:
              </b>{" "}
              {eventData.days}
            </p>
            {eventData.days === "Single-Day" && (
              <>
                <p>
                  <b style={{ fontWeight: "400", color: "#846330" }}>Shift:</b>{" "}
                  {eventData.dayShift}
                </p>
                <p>
                  <b style={{ fontWeight: "400", color: "#846330" }}>
                    Event Date:
                  </b>{" "}
                  {formatDate(eventData.bookDate)}
                </p>
              </>
            )}
            {eventData.days !== "Single-Day" && (
              <>
                <p>
                  <b style={{ fontWeight: "400", color: "#846330" }}>
                    Start Date:
                  </b>{" "}
                  {formatDate(eventData.startDate)}
                </p>
                <p>
                  <b style={{ fontWeight: "400", color: "#846330" }}>
                    End Date:
                  </b>{" "}
                  {formatDate(eventData.endDate)}
                </p>
              </>
            )}
            <p>
              <b style={{ fontWeight: "400", color: "#846330" }}>
                Estimated Guests:
              </b>{" "}
              {eventData.estimatedGuests}
            </p>
            <br />
            <p>
              <b style={{ fontWeight: "400", color: "#846330" }}>
                Selected Hall:
              </b>{" "}
              {eventData.hallName}
            </p>
            <p>
              <b style={{ fontWeight: "400", color: "#846330" }}>Buffet:</b>{" "}
              {eventData.buffet}
            </p>{" "}
            <p>
              <br />
              <b style={{ fontWeight: "600", fontSize: "18px" }}>
                <b
                  style={{
                    fontWeight: "600",
                    color: "#846330",
                    fontSize: "18px",
                  }}
                >
                  Total:
                </b>{" "}
                Rs. {eventData.price?.toLocaleString() ?? "0"}
              </b>
            </p>
            <button
              className="checkoutbtn"
              onClick={() => {
                handleCheckout();
                fetchEventData();
                updateDocument(latestId);
                console.log(latestId);
              }}
            >
              Book
            </button>
          </div>
          {/* <div className="eventmanagement"></div> */}
        </div>
      </div>

      {showModal && (
        <div className="modal" style={{ marginLeft: "60px" }}>
          <div className="modal-content">
            <Link to="/home">
              <span
                className="close"
                onClick={handleCloseModal}
                style={{ cursor: "pointer" }}
              >
                &times;
              </span>
            </Link>

            <h2>Venue Added!</h2>
            <p>
              Your venue has been successfully added. Our team will get back to
              you for confirmation of the event
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

export default Checkout;
