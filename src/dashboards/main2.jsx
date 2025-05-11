
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./student.css";
import Student from "./student.jsx"


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Student />
  </StrictMode>,
)
