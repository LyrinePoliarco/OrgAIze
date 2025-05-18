
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./CsscStudent.css";
import CsscStudent from "./CsscStudent.jsx"


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CsscStudent />
  </StrictMode>,
)