import React, { useState } from "react";
import Nav from "../components/Nav/Nav";
import FixedButton from "../components/FixedButton/FixedButton";
import HallSelection from "../components/HallSelection/HallSelection";
import Buffet from "../components/Buffet/Buffet";
import Checkout from "../components/Checkout/Checkout";
import HallKathmandu from "../components/HallKathmandu/HallKathmandu";
import HallBhaktapur from "../components/HallBhaktapur/HallBhaktapur";
import HallPatan from "../components/HallPatan/HallPatan";
import HallKritipur from "../components/HallKritipur/HallKritipur";

const BookVenue = () => {
  const [selectedHall, setSelectedHall] = useState(null);
  const [showBuffet, setShowBuffet] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  const handleBackClick = () => {
    if (showCheckout) {
      setSelectedHall(false);
      setShowBuffet(true);
      setShowCheckout(false);
    } else {
      setSelectedHall(null);
      setShowBuffet(false);
      setShowCheckout(false);
    }
  };

  const handleImageClick = (hallName) => {
    setSelectedHall(hallName);
  };

  const handleSelectClick = () => {
    setShowBuffet(true);
    setSelectedHall(false);
    setShowCheckout(false);
  };

  const handlebuffetSelectClick = () => {
    setShowBuffet(false);
    setShowCheckout(true);
  };

  return (
    <div>
      <Nav />

      {selectedHall === "Hall Kathmandu" ? (
        <HallKathmandu
          onBack={handleBackClick}
          onSelectClick={handleSelectClick}
        />
      ) : selectedHall === "Hall Bhaktapur" ? (
        <HallBhaktapur
          onBack={handleBackClick}
          onSelectClick={handleSelectClick}
        />
      ) : selectedHall === "Hall Patan" ? (
        <HallPatan onBack={handleBackClick} onSelectClick={handleSelectClick} />
      ) : selectedHall === "Hall Kritipur" ? (
        <HallKritipur
          onBack={handleBackClick}
          onSelectClick={handleSelectClick}
        />
      ) : showBuffet ? (
        <Buffet
          onBack={handleBackClick}
          onBuffetSelectClick={handlebuffetSelectClick}
        />
      ) : showCheckout ? (
        <Checkout onBack={handleBackClick} />
      ) : (
        <HallSelection
          onImageClick={handleImageClick}
          onSelectClick={handleSelectClick}
        />
      )}
    </div>
  );
};

export default BookVenue;
