import React, { useState } from "react";
import "./HallHomePage.css";
import HallKathmandu from "../HallKathmandu/HallKathmandu";
import HallBhaktapur from "../HallBhaktapur/HallBhaktapur";
import HallPatan from "../HallPatan/HallPatan";
import HallKritipur from "../HallKritipur/HallKritipur";

const HallHomePage = () => {
  const [selectedHall, setSelectedHall] = useState("Kathmandu");

  return (
    <section className="HallImages-Wrapper">
      <h1
        style={{
          fontWeight: "600",
          fontSize: "40px",
          color: "#846330",
          marginBottom: "10px",
        }}
      >
        Our Halls
      </h1>
      <div className="first">
        <h1
          className="hallName"
          style={{
            color: selectedHall === "Kathmandu" ? "#846330" : "",
            cursor: "pointer",
          }}
          onClick={() => setSelectedHall("Kathmandu")}
        >
          Hall Kathmandu
        </h1>
        <h1
          className="hallName"
          style={{
            color: selectedHall === "Bhaktapur" ? "#846330" : "",
            cursor: "pointer",
          }}
          onClick={() => setSelectedHall("Bhaktapur")}
        >
          Hall Bhaktapur
        </h1>

        <h1
          className="hallName"
          style={{
            color: selectedHall === "Patan" ? "#846330" : "",
            cursor: "pointer",
          }}
          onClick={() => setSelectedHall("Patan")}
        >
          Hall Patan
        </h1>

        <h1
          className="hallName"
          style={{
            color: selectedHall === "Kritipur" ? "#846330" : "",
            cursor: "pointer",
          }}
          onClick={() => setSelectedHall("Kritipur")}
        >
          Hall Kritipur
        </h1>
      </div>

      {selectedHall === "Kathmandu" && <HallKathmandu />}
      {selectedHall === "Bhaktapur" && <HallBhaktapur />}
      {selectedHall === "Patan" && <HallPatan />}
      {selectedHall === "Kritipur" && <HallKritipur />}
    </section>
  );
};

export default HallHomePage;
