import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./pages/login";
import Led from "./pages/led";
import ViewLed from "./pages/viewLed"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/light" element={<Led />} />
        <Route path="/view" element={<ViewLed/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
