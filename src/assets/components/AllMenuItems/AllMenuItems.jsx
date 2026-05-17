import React, { useState, useEffect } from "react";
import axios from "axios"; // Import Axios library

const AllMenuItems = () => {
  // State to store the fetched data
  const [goldPackages, setGoldPackages] = useState([]);

  // Fetch data from the API when the component mounts
  useEffect(() => {
    axios
      .get("http://localhost:9000/menu")
      .then((response) => {
        // Access the 'data' property of the response object
        const responseData = response.data.data;
        setGoldPackages(responseData);

        // Check if responseData is an array
        // if (Array.isArray(responseData)) {
        //   // Filter the data to get only gold packages
        //   const goldPackagesData = responseData.filter(
        //     (item) => item.Package === "Silver"
        //   );
        //   setGoldPackages(goldPackagesData);
        //   console.log(goldPackagesData);
        // } else {
        //   console.error("Invalid response data format:", responseData);
        // }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <section className="goldpackage-wrapper">
      <h1>All Menu Items</h1>
      <br />
      {goldPackages.map((item) => (
        <div key={item._id}>
          <p>
            <strong>{item.FoodCategory}: </strong>
            {item.FoodName}
          </p>
          {/* Render other properties as needed */}
        </div>
      ))}
    </section>
  );
};

export default AllMenuItems;
