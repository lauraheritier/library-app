import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { FaUserAlt } from 'react-icons/fa';
import LogoutButton from "../logout/logout.component";
import {Spinner } from 'react-bootstrap';

const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return  <div className="loading-content">
    <Spinner animation="grow" />
    <span>Un momento...</span>
</div>;
  }

  return (
    isAuthenticated && (
      <div>        
        <p><span class="user"><FaUserAlt /></span> {user.email}<span class="logout"><LogoutButton/></span></p>
      </div>
    )
  );
};

export default Profile;