import logo from './logo.svg';
import './App.css';
import MainContainer from "./containers/MainContainer";
import { Container } from 'react-bootstrap';
import Header from "./components/header/header.component";
import { useAuth0 } from "@auth0/auth0-react";
import {Spinner } from 'react-bootstrap';
import {FaBookOpen} from 'react-icons/fa';
import LoginButton from './components/login/login.component';

function App() {
  const { user, isAuthenticated, isLoading } = useAuth0();
let body;
  if (isLoading) {
    return <div className="loading-content">
    <Spinner animation="grow" variant="warning" />
    <span>Un momento...</span>
</div>;
  }
  if(!isAuthenticated) {
    body = 
    <>
     <div className="intro">
    <FaBookOpen/>
     <h1>Kosmos</h1>
     <span><i>Y fue así.</i></span>
    </div>
    
    <LoginButton />
    </>
  } else {
    body = (
    <><Header />
      <MainContainer />
      </>);
  }

 return (
    <div className="App">
      {body}
  </div>
  );
}

export default App;
