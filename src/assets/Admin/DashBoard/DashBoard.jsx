import React, { useState, useEffect } from "react";
import "./Dashboard.css"; // Importing CSS for styling
import { RiHomeFill } from "react-icons/ri"; // Importing icons for dashboard items
import { MdPeopleAlt } from "react-icons/md";
import { BiSolidBuilding } from "react-icons/bi";
import { LuMenuSquare } from "react-icons/lu";
import { MdMeetingRoom } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";
import axios from "axios";
import { useSnackbar } from "notistack";
import { Link } from "react-router-dom";
import DashboardBody from "../DashBoardBody/DashboardBody";
import DashboardCustomer from "../DashboardCustomer/DashboardCustomer";
import BanquetHalls from "../BanquetHalls/BanquetHalls";
import BanquetPackages from "../BanquetPakages/BanquetPackages";

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [unconfirmedData, setUnconfirmedData] = useState([]);
  const [selectedDashboard, setselectedDashboard] = useState("DashboardBody");

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

  const handleLogout = () => {
    setIsLogoutModalOpen(false);

    navigate("/");
  };

  return (
    <section className="dashboardPanel">
      <div className="panel-container">
        <div className="panel">
          <div className="Dashboard-items">
            <button
              className="items"
              onClick={() => setselectedDashboard("DashboardBody")}
            >
              <RiHomeFill /> Dashboard
            </button>
            <br />
            <button
              className="items"
              onClick={() => setselectedDashboard("DashboardCustomer")}
            >
              <MdPeopleAlt /> Customers
            </button>
            <br />
            <button
              className="items"
              onClick={() => setselectedDashboard("BanquetHalls")}
            >
              <MdMeetingRoom /> Banquet Halls
            </button>
            <br />
            <button
              className="items"
              onClick={() => setselectedDashboard("BanquetPackage")}
            >
              <LuMenuSquare /> Package Menu
            </button>
            <br />
            <button
              className="items"
              onClick={() => setIsLogoutModalOpen(true)}
            >
              <FiLogOut />
              Logout
            </button>
          </div>
        </div>
        {selectedDashboard === "DashboardBody" && <DashboardBody />}
        {selectedDashboard === "DashboardCustomer" && <DashboardCustomer />}
        {selectedDashboard === "BanquetHalls" && <BanquetHalls />}
        {selectedDashboard === "BanquetPackage" && <BanquetPackages />}
      </div>

      <Modal
        isOpen={isLogoutModalOpen}
        onRequestClose={() => setIsLogoutModalOpen(false)}
        contentLabel="Logout Confirmation"
        className="Modal"
        overlayClassName="Overlay"
      >
        <h2>Confirm Logout</h2>
        <p>Are you sure you want to logout?</p>
        <button onClick={handleLogout} className="yesbtn">
          Yes
        </button>
        <button onClick={() => setIsLogoutModalOpen(false)} className="nobtn">
          No
        </button>
      </Modal>
    </section>
  );
};

export default Dashboard;

