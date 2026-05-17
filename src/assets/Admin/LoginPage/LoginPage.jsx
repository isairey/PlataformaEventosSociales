import React, { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import axios from "axios";
import "./LoginPage.css";

// The LoginPage component accepts a handleLoginCallback prop for login success callback
const LoginPage = ({ handleLoginCallback }) => {
  const [loading, setLoading] = useState(false); // State to handle loading status
  const { enqueueSnackbar } = useSnackbar(); // Snackbar for showing notifications
  const [username, setUsername] = useState(""); // State to store the fetched admin username
  const [password, setPassword] = useState(""); // State to store the fetched admin password
  const [inputUsername, setInputUsername] = useState(""); // State for user input username
  const [inputPassword, setInputPassword] = useState(""); // State for user input password
  const [invalidCredentials, setInvalidCredentials] = useState(false); // State to handle invalid credentials display

  useEffect(() => {
    fetchEventData(); // Fetch event data on component mount
  }, []);

  // Function to fetch event data from the server
  const fetchEventData = () => {
    setLoading(true); // Set loading to true while fetching data
    axios
      .get(
        "http://localhost:9000/adminroute?_sort=createdAt&_order=desc&_limit=1"
      )
      .then((response) => {
        setLoading(false); // Set loading to false after data is fetched
        const adminData = response.data.data.pop(); // Get the latest admin data
        setUsername(adminData.username); // Set the admin username
        setPassword(adminData.password); // Set the admin password
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

  // Function to handle login process
  const handleLogin = () => {
    if (inputUsername === username && inputPassword === password) {
      // Check if input credentials match the fetched admin credentials
      handleLoginCallback(); // Call the callback function on successful login
    } else {
      setInvalidCredentials(true); // Set invalid credentials to true for display
      setInputUsername(""); // Clear the input username field
      setInputPassword(""); // Clear the input password field
      enqueueSnackbar("Invalid username or password", { variant: "error" }); // Show error notification
    }
  };

  return (
    <section className="login-wrapper">
      <div className="login-container">
        <img src="./images/logo.png" alt="" className="logo" /> {/* Logo image */}

        <div className="login-form">
          <form>
            <h1>Username</h1>
            <input
              type="text"
              value={inputUsername}
              onChange={(e) => setInputUsername(e.target.value)} // Update input username state
            />
            <h1>Password</h1>
            <input
              type="password"
              value={inputPassword}
              onChange={(e) => setInputPassword(e.target.value)} // Update input password state
            />
          </form>
        </div>
        {invalidCredentials && (
          <p
            className="invalid-credentials-text"
            style={{ color: "red", marginTop: "10px" }}
          >
            Invalid username or password
          </p> // Display invalid credentials message
        )}
        <button className="login-btn" onClick={handleLogin}>
          Login
        </button> {/* Login button */}
      </div>
    </section>
  );
};

export default LoginPage;

