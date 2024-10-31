import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import PrizeWheel from "./PrizeWheel.jsx";
import PrizeWheelLast from "./PrizeWheelLast.jsx";
import GoldenWheelSpin from "./GoldenWheelSpin.jsx";
import SpinWheelVerone from "./SpinWheelVerone.jsx";
import "./index.css";
import PeopleWheelSpin from "../src/PeopleWheelSpin.jsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <StrictMode>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <SpinWheelVerone /> 
            </>
          }
        />
        <Route path="/Peoplegold" element={<PeopleWheelSpin />} />
        <Route path="Page2" element={<GoldenWheelSpin />}/>
      </Routes>
    </StrictMode>
  </BrowserRouter>
);
