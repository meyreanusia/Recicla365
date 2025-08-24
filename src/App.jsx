import { Routes, Route } from "react-router-dom";
import Login from './page/login'
import './App.css'
import Register from "./page/register";
import MenuNavbar from "./page/menuNavegacao";

function App() {

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/navegacao" element={<MenuNavbar/>}></Route>
   </Routes>
  )
}

export default App
