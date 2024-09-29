// src/components/SignOut.js
import React from "react";
import { authController } from "../../config/base";

const SignOut = () => {
  const handleSignOut = async () => {
    try {
      authController.signOut()
      console.log("User signed out!");
    } catch (error) {
      console.log(error.message);
    }
  };

  

  return (
    <button className="signout_btn" onClick={handleSignOut}>
      Sign Out
    </button>
  );
};

export default SignOut;
