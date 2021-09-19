import logo from './logo.svg';
import './App.css';
import MainContainer from "./containers/MainContainer";
import { Container } from 'react-bootstrap';


function App() {
  return (
    <div className="App">
    <Container>
     <MainContainer />
    </Container>
  </div>
  );
}

export default App;
