import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import {Button} from 'react-bootstrap';
import {FaSignOutAlt} from  'react-icons/fa';

const LogoutButton = () => {
  const { logout } = useAuth0();

  return (
    <Button variant="link" onClick={() => logout({ returnTo: window.location.origin })}>
        <FaSignOutAlt />
    </Button>
  );
};

export default LogoutButton;