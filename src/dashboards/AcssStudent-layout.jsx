
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./AcssStudent.css";
import AcssStudent from "./AcssStudent.jsx"


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AcssStudent />
  </StrictMode>,
)
