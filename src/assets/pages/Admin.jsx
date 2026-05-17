import React, { useState } from "react";

import LoginPage from "../Admin/LoginPage/LoginPage";
import DashBoard from "../Admin/DashBoard/DashBoard";

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginCallback = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <div>
      {isLoggedIn ? (
        <DashBoard onLogout={handleLogout} />
      ) : (
        <LoginPage handleLoginCallback={handleLoginCallback} />
      )}
    </div>
  );
};

export default Admin;
