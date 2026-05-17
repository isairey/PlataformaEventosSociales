import React, { useRef, useState } from "react";
import { imageData } from "./mockData";
import "./HallKathmandu.css";
import { useSnackbar } from "notistack";
import axios from "axios";

const HallKathmandu = ({ onSelectClick, onBack }) => {
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleSaveBook = () => {
    setLoading(true);
    axios
      .get("http://localhost:9000/books?_sort=createdAt&_order=desc&_limit=1")
      .then((response) => {
        setLoading(false);
        const latestData = response.data.data.pop(); // Get the last element of the data array
        const latestId = latestData._id; // Get the _id of the latest data
        console.log("Latest ID:", latestId);
        enqueueSnackbar("Latest data retrieved. Check console.", {
          variant: "info",
        });

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
      hallName: "Hall Kathmandu",
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

  const scrollRef = useRef(null);
  const [showBackButton, setShowBackButton] = useState(false);

  const handleScroll = () => {
    const container = scrollRef.current;
    if (container) {
      setShowBackButton(container.scrollLeft > 0);
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    }
  };

  return (
    <div className="container">
      {/* <button className="backbtn" onClick={onBack}>
        ⬅ Back
      </button> */}
      <div className="kathmanducontainer">
        <h1
          style={{
            color: "#846330",
            fontWeight: "600",
            fontSize: "35px",
          }}
        >
          Hall Kathmandu
        </h1>
        <p style={{ color: "gray" }}>Capacity 600-1100</p>
        <p style={{ paddingBottom: "20px", color: "gray" }}>
          Events: Wedding. Anniversary. Engagement. Bartamanda. Reception.
        </p>
        <div className="kathmandu-wrapper">
          <div className="column">
            <div className="photo">
              <img src="/images/HallKathmandu-2.jpg" alt="" />
            </div>
            <div className="photo">
              <img src="/images/Hall Kathmandu.jpg" alt="" />
            </div>
          </div>
          <div className="column">
            <div className="photo">
              <img src="/images/HallKathmandu-1.jpeg" alt="" />
            </div>
          </div>
        </div>
        {/* <button
          className="selectbtn"
          onClick={() => {
            onSelectClick();
            handleSaveBook();
          }}
        >
          Select Hall
        </button> */}
      </div>
    </div>
  );
};

export default HallKathmandu;
