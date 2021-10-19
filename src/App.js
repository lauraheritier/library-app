import logo from './logo.svg';
import './App.css';
import MainContainer from "./containers/MainContainer";
import { Container } from 'react-bootstrap';
import Header from "./components/header/header.component";
import { useAuth0 } from "@auth0/auth0-react";
import {Spinner } from 'react-bootstrap';

function App() {
  const { user, isAuthenticated, isLoading } = useAuth0();
let body;
  if (isLoading) {
    return <div className="loading-content">
    <Spinner animation="grow" />
    <span>Un momento...</span>
</div>;
  }
  if(!isAuthenticated) {
    body = 
    <>
    <Header />
     <h1 class="intro">Mi Biblioteca</h1>
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
