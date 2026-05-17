import React, { useState, useEffect } from "react";
import "./DashboardCustomer.css";
import axios from "axios";
import { useSnackbar } from "notistack";
import { GrRefresh } from "react-icons/gr";
import { MdDelete } from "react-icons/md";
import { IoIosAddCircle } from "react-icons/io";

const DashboardCustomer = () => {
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [unconfirmedData, setUnconfirmedData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [activeTab, setActiveTab] = useState("newlyAdded"); // State to manage active tab

  useEffect(() => {
    fetchEventData();
    fetchAllEventData();
  }, []);

  const fetchEventData = () => {
    setLoading(true);
    axios
      .get("http://localhost:9000/books")
      .then((response) => {
        setLoading(false);
        const dbData = response.data.data.filter(
          (entry) => !entry.confirmed && entry.checkedOut
        );
        setUnconfirmedData(dbData);
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

  const fetchAllEventData = () => {
    setLoading(true);
    axios
      .get("http://localhost:9000/books")
      .then((response) => {
        setLoading(false);
        const dbData = response.data.data.filter(
          (entry) => entry.confirmed && entry.checkedOut && !entry.delete
        );
        setAllData(dbData);
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

  const handleAccept = (entryId) => {
    axios
      .put(`http://localhost:9000/books/${entryId}`, { confirmed: true })
      .then((response) => {
        setUnconfirmedData((prevData) =>
          prevData.filter((entry) => entry._id !== entryId)
        );
        enqueueSnackbar("Event confirmed successfully", {
          variant: "success",
        });
      })
      .catch((error) => {
        enqueueSnackbar("Error confirming event", { variant: "error" });
        console.log(error);
      });
  };

  const handleDecline = (entryId) => {
    axios
      .put(`http://localhost:9000/books/${entryId}`, { checkedOut: false })
      .then((response) => {
        setUnconfirmedData((prevData) =>
          prevData.filter((entry) => entry._id !== entryId)
        );
        enqueueSnackbar("Event declined successfully", {
          variant: "success",
        });
      })
      .catch((error) => {
        enqueueSnackbar("Error declining event", { variant: "error" });
        console.log(error);
      });
  };

  const handleDelete = (entryId) => {
    axios
      .put(`http://localhost:9000/books/${entryId}`, { delete: true })
      .then((response) => {
        setUnconfirmedData((prevData) =>
          prevData.filter((entry) => entry._id !== entryId)
        );
        setAllData((prevData) =>
          prevData.filter((entry) => entry._id !== entryId)
        );
        enqueueSnackbar("Event declined successfully", {
          variant: "success",
        });
      })
      .catch((error) => {
        enqueueSnackbar("Error declining event", { variant: "error" });
        console.log(error);
      });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  return (
    <div className="dashboardbody">
      <div className="customer-content">
        <h1
          style={{
            color: "#846330",
            marginLeft: "40px",
            paddingTop: "20px",
            fontWeight: "600",
            fontSize: "25px",
          }}
        >
          Customers
        </h1>

        <div className="tabs">
          <button
            className={`tab ${
              activeTab === "newlyAdded" ? "active" : ""
            } linkbtn`}
            onClick={() => setActiveTab("newlyAdded")}
          >
            Newly Added Events
          </button>

          <h1>|</h1>
          <button
            className={`tab ${
              activeTab === "customerData" ? "active" : ""
            } linkbtn`}
            onClick={() => {
              setActiveTab("customerData");
              fetchAllEventData();
            }}
          >
            Customer Data
          </button>
        </div>
        {activeTab === "newlyAdded" && (
          <div className="dashboardcontents">
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
                  {unconfirmedData.length === 0 ? (
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
                            ? formatDate(entry.bookDate)
                            : `${formatDate(entry.startDate)} to ${formatDate(
                                entry.endDate
                              )}`}
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
        )}
        {activeTab === "customerData" && (
          <div className="dbtables">
            <div className="heading">
              {/* <button className="refreshbtn">
                <GrRefresh style={{ fontSize: "30px", fontWeight: "500" }} />
              </button> */}
            </div>
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
                  {allData.map((entry) => (
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
                          ? formatDate(entry.bookDate)
                          : `${formatDate(entry.startDate)} to
                          ${formatDate(entry.endDate)}`}
                      </td>
                      <td>
                        <button className="addbtn">
                          <IoIosAddCircle
                            style={{
                              fontSize: "30px",
                              fontWeight: "500",
                              color: "black",
                            }}
                          />
                        </button>
                        <button
                          className="deletebtn"
                          onClick={() => handleDelete(entry._id)}
                        >
                          <MdDelete
                            style={{
                              fontSize: "30px",
                              fontWeight: "500",
                              color: "red",
                            }}
                          />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardCustomer;
