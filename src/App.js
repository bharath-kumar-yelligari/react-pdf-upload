import './App.css';
import PdfManager from './PdfManager';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div className="App">
      <ToastContainer position="top-right" autoClose={3000} />
      <PdfManager></PdfManager>
    </div>
  );
}

export default App;
