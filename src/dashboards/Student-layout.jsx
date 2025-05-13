
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./Student.css";
import Student from "./Student.jsx"


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Student />
  </StrictMode>,
)
