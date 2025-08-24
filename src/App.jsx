import { Routes, Route } from "react-router-dom";
import Login from './page/login'
import './App.css'
import Register from "./page/register";

function App() {

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
   </Routes>
  )
}

export default App
