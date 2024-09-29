import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "./Auth";
import SignOut from "./SignOut";
import { auth } from "../../config/firebase";

const ProtectedRoute = ({ children }) => {
  const {currentUser} = useContext(AuthContext);
  const location = useLocation();

  if (!currentUser) {
    // If user is not authenticated, redirect to sign-in and save the target URL
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return (
    <>
      <SignOut />
      {children}
    </>
  );
};

export default ProtectedRoute;