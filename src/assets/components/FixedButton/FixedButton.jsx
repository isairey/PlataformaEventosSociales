import React, { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import axios from "axios";
import "./FixedButton.css";

const FixedButton = () => {
  const [loading, setLoading] = useState(false);
  const [eventData, setEventData] = useState({});
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    fetchEventData();
  }, []);

  const fetchEventData = () => {
    setLoading(true);
    axios
      .get("http://localhost:9000/books?_sort=createdAt&_order=desc&_limit=1")
      .then((response) => {
        setLoading(false);
        const latestData = response.data.data.pop();
        setEventData(latestData);

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

  return (
    <div className="fixed-button">
      <div className="pricearea">
        <h1>
          <b>Rs. </b> {eventData.price}
        </h1>
      </div>
    </div>
  );
};

export default FixedButton;
