import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { FaSignOutAlt } from 'react-icons/fa';
import { Spinner } from 'react-bootstrap';

const Profile = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuth0();

  if (isLoading) {
    return <div className="loading-content">
      <Spinner animation="grow" variant="warning"/>
      <span>Un momento...</span>
    </div>;
  }

  return (
    isAuthenticated && (
      <span className="logout"><a onClick={() => logout({ returnTo: window.location.origin })}>    <FaSignOutAlt /> </a></span>
    )
  );
};

export default Profile;