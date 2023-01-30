import "./App.css";
import Home from "./components/pages/Home";
import Register from "./components/pages/Register";
import Login from "./components/pages/Login";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Alerts from "./components/Alerts";
import { AlertProvider } from "./modules/AlertsContextProvider";

function App() {
  return (
    <AlertProvider>
      <Router>
        <div className="App">
          <div className="content"></div>
          <Alerts />
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/register" element={<Register />}></Route>
            <Route path="/login" element={<Login />}></Route>
          </Routes>
        </div>
      </Router>
    </AlertProvider>
  );
}

export default App;
