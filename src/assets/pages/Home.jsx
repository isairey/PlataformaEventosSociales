import Hero from "../components/Hero/Hero";
import About from "../components/About/About";
import Occasion from "../components/Occasion/Occasion";
import CheckAvailability from "../components/CheckAvailability/CheckAvailability";
import { Footer } from "../components/Footer/Footer";
import React, { useState, useEffect } from "react";
import axios from "axios";
import HallHomePage from "../components/HallHomePage/HallHomePage";

const Home = () => {
  // const [informations, setInformations] = useState([]);
  // const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   setLoading(true);
  //   axios
  //     .get("http://localhost:9000/books")
  //     .then((response) => {
  //       setBooks(response.data.data);
  //       setLoading(false);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //       setLoading(false);
  //     });
  // }, []);
  return (
    <div>
      <Hero />
      {/* <CheckAvailability /> */}
      <About />
      <Occasion />
      <HallHomePage />
      <Footer />
    </div>
  );
};

export default Home;
