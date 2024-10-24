import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import PrizeWheel from './PrizeWheel.jsx'
import PrizeWheelLast from './PrizeWheelLast.jsx'
import GoldenWheelSpin from './GoldenWheelSpin.jsx'
import SpinWheelVerone from './SpinWheelVerone.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode >
    {/* <App /> */}
   <div className='display-wheel'>
   <SpinWheelVerone/> 
    {/* <PrizeWheelLast/> */}
    <GoldenWheelSpin/>
   </div>
    
   
  </StrictMode>,
)
