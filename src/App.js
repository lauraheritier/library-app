import logo from './logo.svg';
import './App.css';
import CrudForm from "./components/CrudForm";
import { Container } from 'react-bootstrap';

function App() {
  return (
    <div className="App">
      <Container>
        <CrudForm itemType={1} action={true} mainTitle="Socios" />
      </Container>
    </div>
  );
}

export default App;
