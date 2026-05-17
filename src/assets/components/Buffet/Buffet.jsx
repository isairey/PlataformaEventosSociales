import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSnackbar } from "notistack";
import "./Buffet.css";
import { IoMdArrowRoundBack } from "react-icons/io";
import GoldPackage from "../GoldPackage/GoldPackage";
import SilverPackge from "../SliverPackage/SilverPackage";
import PlatinumPackage from "../PlatinumPackage/PlatinumPackage";

const Buffet = ({ onBack, onBuffetSelectClick }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [buffetData, setBuffetData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedHall, setSelectedHall] = useState("Gold Package");

  useEffect(() => {
    const fetchBuffetData = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:9000/packages");
        setBuffetData(response.data.data);
        setLoading(false);
      } catch (error) {
        enqueueSnackbar("Error retrieving buffet data", { variant: "error" });
        console.error("Error fetching buffet data:", error);
        setLoading(false);
      }
    };
    fetchBuffetData();
  }, [enqueueSnackbar]);

  const handleSaveBook = (buffetType, buffetPrice) => {
    axios
      .get("http://localhost:9000/books?_sort=createdAt&_order=desc&_limit=1")
      .then((response) => {
        const latestData = response.data.data.pop();
        const latestId = latestData._id;
        let fPrice =
          latestData.price + buffetPrice * latestData.estimatedGuests;
        axios
          .put(`http://localhost:9000/books/${latestId}`, {
            buffet: buffetType,
            price: fPrice,
          })
          .then(() => {
            enqueueSnackbar("Buffet package selected successfully", {
              variant: "success",
            });
            onBuffetSelectClick();
          })
          .catch((error) => {
            enqueueSnackbar("Error selecting buffet package", {
              variant: "error",
            });
            console.log(error);
          });
      })
      .catch((error) => {
        enqueueSnackbar("Error retrieving latest data", { variant: "error" });
        console.log(error);
      });
  };

  return (
    <section className="buffet-wrapper">
      <div className="left-sidebuffet">
        <button
          onClick={onBack}
          className="backbtn"
          style={{ fontSize: "20px", paddingLeft: "60px" }}
        >
          <IoMdArrowRoundBack /> Back
        </button>
        <div className="buffet-container">
          <h1
            style={{
              color: "#846330",
              fontWeight: "500",
              marginBottom: "40px",
            }}
          >
            Hall Selection / Buffet Selection
          </h1>
          <div className="buffetcontents">
            {loading ? (
              <p>Loading buffet data...</p>
            ) : (
              <div className="buffetpackages">
                {buffetData.map((buffet, index) => (
                  <div
                    key={index}
                    className="buffetpackage"
                    style={{ display: "flex" }}
                  >
                    <img
                      src={`/images/${buffet.packageName}.jpg`}
                      alt=""
                      className="buffetimages"
                    />
                    <div className="buffet-des">
                      <h1>{buffet.packageName}</h1>
                      <p>Per Person Rs. {buffet.pricePerPlate}</p>
                      {/* <p>Items: {buffet.items}</p> */}
                      <div className="buttons">
                        <button
                          className="select"
                          onClick={() => {
                            handleSaveBook(
                              buffet.packageName,
                              buffet.pricePerPlate
                            );
                          }}
                        >
                          Select
                        </button>
                        <button
                          className="secondarybtn"
                          onClick={() => setSelectedHall(buffet.packageName)}
                        >
                          View Menu
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="right-sidebuffet">
        {selectedHall === "Gold Package" && <GoldPackage />}
        {selectedHall === "Silver Package" && <SilverPackge />}
        {selectedHall === "Platinum Package" && <PlatinumPackage />}
      </div>
    </section>
  );
};

export default Buffet;
