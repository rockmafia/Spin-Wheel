import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import PrizeWheel from './PrizeWheel.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode >
    {/* <App /> */}
    <PrizeWheel/>
  </StrictMode>,
)
