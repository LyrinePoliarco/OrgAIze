
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./Acss.css";
import Acss from "./Acss.jsx"


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Acss />
  </StrictMode>,
)
