import logo from './logo.svg';
import './App.css';
import CrudForm from "./components/CrudForm";

function App() {
  return (
    <div className="App">
      <CrudForm dataType={2} action={true} mainTitle="Socios"/>   
    </div>
  );
}

export default App;
