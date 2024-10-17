import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import PrizeWheel from './PrizeWheel.jsx'
import PrizeWheelLast from './PrizeWheelLast.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode >
    {/* <App /> */}
    {/* <PrizeWheel/> */}
    <PrizeWheelLast/>
  </StrictMode>,
)
