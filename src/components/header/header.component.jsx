import React from "react";
import LoginButton from "../login/login.component";
import Profile from "../profile/profile.component";
import { useAuth0 } from "@auth0/auth0-react";
import {FaBookOpen} from 'react-icons/fa';

const Header = () => {
    const {isAuthenticated } = useAuth0();
    if(!isAuthenticated) {

        return (<div className="header"><div className="loguito"><FaBookOpen/> <span>Kosmos</span></div><LoginButton /></div>)
      } else return (
       <div className="header"><div className="loguito"><FaBookOpen/> <span>Kosmos</span></div><Profile/></div>
       )
};

export default Header;