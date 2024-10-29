import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import PrizeWheel from "./PrizeWheel.jsx";
import PrizeWheelLast from "./PrizeWheelLast.jsx";
import GoldenWheelSpin from "./GoldenWheelSpin.jsx";
import SpinWheelVerone from "./SpinWheelVerone.jsx";
import "./index.css";
import PeopleWheelSpin from "../src/PeopleWheelSpin.jsx";
import { BrowserRouter as Router,
  Route,
  Routes,
  BrowserRouter, } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <StrictMode>
      {/* <App /> */}

      <Routes>
        <Route
          path="/"
          element={
            <>
              {" "}
              <SpinWheelVerone /> <GoldenWheelSpin />{" "}
            </>
          }
        />
        <Route path="/Peoplegold" element={<PeopleWheelSpin />} />

        {/* <SpinWheelVerone/> 
    {/* <PrizeWheelLast/> */}
        {/* <GoldenWheelSpin/>  */}
      </Routes>
    </StrictMode>
    ,
  </BrowserRouter>
);
