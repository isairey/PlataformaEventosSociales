import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSnackbar } from "notistack";
import "./BanquetHalls.css";
import { IoMdAddCircle } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { FaRegEdit } from "react-icons/fa";

const BanquetHalls = () => {
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [hallData, setHallData] = useState([]);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isEditPopupVisible, setIsEditPopupVisible] = useState(false);
  const [currentHall, setCurrentHall] = useState(null);
  const [newHall, setNewHall] = useState({
    name: "",
    minCapacity: "",
    maxCapacity: "",
    priceShift: "",
    priceDay: "",
    image: null,
  });

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

  useEffect(() => {
    fetchHallData();
  }, []);

  const handleShowPopup = () => {
    setIsPopupVisible(true);
  };

  const handleClosePopup = () => {
    setIsPopupVisible(false);
  };

  const handleShowEditPopup = (hall) => {
    setCurrentHall(hall);
    setNewHall(hall);
    setIsEditPopupVisible(true);
  };

  const handleCloseEditPopup = () => {
    setIsEditPopupVisible(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewHall((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDeleteHall = async (id) => {
    try {
      setLoading(true);
      await axios.patch(`http://localhost:9000/halls/${id}`, { delete: true });
      fetchHallData();
      enqueueSnackbar("Hall deleted successfully", { variant: "success" });
    } catch (error) {
      enqueueSnackbar("Error deleting hall", { variant: "error" });
      console.error("Error deleting hall:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddHall = async () => {
    const dbpostdata = {
      name: newHall.name,
      minCapacity: newHall.minCapacity,
      maxCapacity: newHall.maxCapacity,
      priceShift: newHall.priceShift,
      priceDay: newHall.priceDay,
    };

    try {
      setLoading(true);
      await axios.post("http://localhost:9000/halls", dbpostdata);
      fetchHallData(); // Refresh the list of halls
      setLoading(false);
      enqueueSnackbar("Hall added successfully", { variant: "success" });
      handleClosePopup(); // Close the popup
    } catch (error) {
      setLoading(false);
      enqueueSnackbar("Error adding hall", { variant: "error" });
      console.error("Error adding hall:", error);
    }
  };

  const handleEditHall = async () => {
    const dbpostData = {
      name: newHall.name,
      minCapacity: newHall.minCapacity,
      maxCapacity: newHall.maxCapacity,
      priceShift: newHall.priceShift,
      priceDay: newHall.priceDay,
      image: newHall.image,
    };

    try {
      setLoading(true);
      await axios.put(
        `http://localhost:9000/halls/${currentHall._id}`,
        dbpostData
      );
      fetchHallData(); // Refresh the list of halls
      setLoading(false);
      enqueueSnackbar("Hall updated successfully", { variant: "success" });
      handleCloseEditPopup(); // Close the popup
    } catch (error) {
      setLoading(false);
      enqueueSnackbar("Error updating hall", { variant: "error" });
      console.error("Error updating hall:", error);
    }
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
        Banquet Halls
      </h1>
      <button className="addHall" onClick={handleShowPopup}>
        <IoMdAddCircle style={{ fontSize: "30px" }} />
        <h2 style={{ marginLeft: "5px", fontSize: "16px", fontWeight: "500" }}>
          Add Hall
        </h2>
      </button>
      <div className="container-halls">
        <div className="hall-container" style={{ marginTop: "20px" }}>
          {hallData.map((hall, index) => {
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
                  </p>
                  <div className="buttons">
                    <FaRegEdit
                      style={{
                        color: "black",
                        fontSize: "25px",
                        marginTop: "10px",
                        marginRight: "10px",
                      }}
                      onClick={() => handleShowEditPopup(hall)}
                    />
                    <button
                      className="halldeletebtn"
                      onClick={() => handleDeleteHall(hall._id)}
                    >
                      <MdDelete
                        style={{
                          fontSize: "25px",
                          // color: "red",
                          marginTop: "10px",
                        }}
                      />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="left-side"></div>
      </div>
      {isPopupVisible && (
        <div className="popup-halls">
          <div className="overlay">
            <div className="demo">
              <div className="popup-title">
                <h2
                  style={{
                    marginLeft: "50px",
                    fontSize: "30px",
                    fontWeight: "600",
                  }}
                >
                  Add Hall
                </h2>
                <button className="closebtn" onClick={handleClosePopup}>
                  <IoClose style={{ fontSize: "30px" }} />
                </button>
              </div>
              <div className="popup-inputs">
                <h3>Hall Name</h3>
                <input
                  type="text"
                  className="inputs"
                  name="name"
                  value={newHall.name}
                  onChange={handleInputChange}
                />
                <div className="capacity-field">
                  <h3>
                    Min <br /> Capacity:
                  </h3>
                  <input
                    type="text"
                    className="capacity-inputs"
                    name="minCapacity"
                    value={newHall.minCapacity}
                    onChange={handleInputChange}
                  />
                  <h3>
                    Max <br /> Capacity:
                  </h3>
                  <input
                    type="text"
                    className="capacity-inputs"
                    name="maxCapacity"
                    value={newHall.maxCapacity}
                    onChange={handleInputChange}
                  />
                </div>
                <h3>Price Per Shift</h3>
                <input
                  type="text"
                  className="inputs"
                  name="priceShift"
                  value={newHall.priceShift}
                  onChange={handleInputChange}
                  placeholder="in NRS"
                />
                <h3>Price Per Day</h3>
                <input
                  type="text"
                  className="inputs"
                  name="priceDay"
                  value={newHall.priceDay}
                  onChange={handleInputChange}
                  placeholder="in NRS"
                />
                {/* <h3>
                  {" "}
                  <FaUpload />
                  Upload Image
                </h3>
                <input
                  type="file"
                  className="inputs"
                  onChange={handleImageChange}
                />
                <img width={100} height={100} src={imageBase64} alt="" /> */}
              </div>
              <button className="dataaddbtn" onClick={handleAddHall}>
                Add Hall
              </button>
            </div>
          </div>
        </div>
      )}
      {isEditPopupVisible && (
        <div className="popup-halls">
          <div className="overlay">
            <div className="demo">
              <div className="popup-title">
                <h2
                  style={{
                    marginLeft: "50px",
                    fontSize: "30px",
                    fontWeight: "600",
                  }}
                >
                  Edit Hall
                </h2>
                <button className="closebtn" onClick={handleCloseEditPopup}>
                  <IoClose style={{ fontSize: "30px" }} />
                </button>
              </div>
              <div className="popup-inputs">
                <h3>Hall Name</h3>
                <input
                  type="text"
                  className="inputs"
                  name="name"
                  value={newHall.name}
                  onChange={handleInputChange}
                />
                <div className="capacity-field">
                  <h3>
                    Min <br /> Capacity:
                  </h3>
                  <input
                    type="text"
                    className="capacity-inputs"
                    name="minCapacity"
                    value={newHall.minCapacity}
                    onChange={handleInputChange}
                  />
                  <h3>
                    Max <br /> Capacity:
                  </h3>
                  <input
                    type="text"
                    className="capacity-inputs"
                    name="maxCapacity"
                    value={newHall.maxCapacity}
                    onChange={handleInputChange}
                  />
                </div>
                <h3>Price Per Shift</h3>
                <input
                  type="text"
                  className="inputs"
                  name="priceShift"
                  value={newHall.priceShift}
                  onChange={handleInputChange}
                  placeholder="in NRS"
                />
                <h3>Price Per Day</h3>
                <input
                  type="text"
                  className="inputs"
                  name="priceDay"
                  value={newHall.priceDay}
                  onChange={handleInputChange}
                  placeholder="in NRS"
                />
                {/* Image upload functionality can be added here */}
              </div>
              <button className="dataaddbtn" onClick={handleEditHall}>
                Edit Hall
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BanquetHalls;
