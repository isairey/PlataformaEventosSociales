import "../DashBoard/Dashboard.css"; // Importing CSS for styling
import React, { useState, useEffect } from "react";

import { RiHomeFill } from "react-icons/ri"; // Importing icons
import { MdPeopleAlt } from "react-icons/md";
import { BiSolidBuilding } from "react-icons/bi";
import { LuMenuSquare } from "react-icons/lu";
import { MdMeetingRoom } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";
import axios from "axios"; // Importing axios for HTTP requests
import { useSnackbar } from "notistack"; // Importing notistack for notifications
import { Link } from "react-router-dom"; // Importing Link for navigation

const DashboardBody = () => {
  const [loading, setLoading] = useState(false); // State to handle loading status
  const { enqueueSnackbar } = useSnackbar(); // Snackbar for showing notifications
  const [unconfirmedData, setUnconfirmedData] = useState([]); // State to store unconfirmed event data

  useEffect(() => {
    fetchEventData(); // Fetch event data on component mount
  }, []);

  // Function to fetch event data from the server
  const fetchEventData = () => {
    setLoading(true); // Set loading to true while fetching data
    axios
      .get("http://localhost:9000/books")
      .then((response) => {
        setLoading(false); // Set loading to false after data is fetched
        const dbData = response.data.data.filter(
          (entry) => !entry.confirmed && entry.checkedOut
        ); // Filter unconfirmed and checked-out entries
        setUnconfirmedData(dbData); // Set the unconfirmed data
        enqueueSnackbar("Event data retrieved successfully", {
          variant: "success",
        }); // Show success notification
      })
      .catch((error) => {
        setLoading(false); // Set loading to false in case of error
        enqueueSnackbar("Error retrieving event data", { variant: "error" }); // Show error notification
        console.log(error); // Log the error
      });
  };

  // Function to format date into MM/DD/YYYY
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  // Function to handle accepting an event
  const handleAccept = (entryId) => {
    axios
      .put(`http://localhost:9000/books/${entryId}`, { confirmed: true })
      .then((response) => {
        setUnconfirmedData((prevData) =>
          prevData.filter((entry) => entry._id !== entryId)
        ); // Remove confirmed entry from unconfirmed data
        enqueueSnackbar("Event confirmed successfully", {
          variant: "success",
        }); // Show success notification
      })
      .catch((error) => {
        enqueueSnackbar("Error confirming event", { variant: "error" }); // Show error notification
        console.log(error); // Log the error
      });
  };

  // Function to handle declining an event
  const handleDecline = (entryId) => {
    axios
      .put(`http://localhost:9000/books/${entryId}`, { checkedOut: false })
      .then((response) => {
        setUnconfirmedData((prevData) =>
          prevData.filter((entry) => entry._id !== entryId)
        ); // Remove declined entry from unconfirmed data
        enqueueSnackbar("Event declined successfully", {
          variant: "success",
        }); // Show success notification
      })
      .catch((error) => {
        enqueueSnackbar("Error declining event", { variant: "error" }); // Show error notification
        console.log(error); // Log the error
      });
  };

  return (
    <div className="dashboard-body">
      <h1
        style={{
          color: "#846330",
          marginLeft: "40px",
          paddingTop: "20px",
          fontWeight: "600",
          fontSize: "25px",
        }}
      >
        Hamro Banquet Dashboard
      </h1>
      <p style={{ marginLeft: "40px" }}>Welcome Admin,</p>
      <div className="summary">
        {/* Summary section for future use */}
        <div className="summary-contents">
          {/* Summary contents can be added here */}
        </div>
      </div>

      <div className="dashboard-contents">
        <h2>Newly Added Events</h2>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Contact Number</th>
                <th>Price</th>
                <th>Event Type</th>
                <th>Hall Name</th>
                <th>Estimated Guests</th>
                <th>Days</th>
                <th>Booked Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {unconfirmedData.length === 0 ? ( // Check if there is no data
                <tr>
                  <td colSpan="9">No data to show</td>
                </tr>
              ) : (
                unconfirmedData.map((entry) => (
                  <tr key={entry._id}>
                    <td>{entry.name}</td>
                    <td>{entry.phoneNo}</td>
                    <td>Rs. {entry.price}</td>
                    <td>{entry.eventType}</td>
                    <td>{entry.hallName}</td>
                    <td>{entry.estimatedGuests}</td>
                    <td>{entry.days}</td>
                    <td>
                      {entry.days === "Single-Day"
                        ? formatDate(entry.bookDate) // Format single-day event date
                        : `${formatDate(entry.startDate)} to ${formatDate(
                            entry.endDate
                          )}`} // Format multi-day event date
                    </td>
                    <td>
                      <button
                        className="acceptbtn"
                        onClick={() => handleAccept(entry._id)}
                      >
                        ACCEPT
                      </button>
                      <button
                        className="declinebtn"
                        onClick={() => handleDecline(entry._id)}
                      >
                        DECLINE
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardBody;
