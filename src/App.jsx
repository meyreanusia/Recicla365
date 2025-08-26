import { Routes, Route } from "react-router-dom";
import Login from './page/login'
import './App.css'
import Register from "./page/register";
import Locais from "./page/locais";
// import Dashboard from "./page/Dashboard";

function App() {

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/locais" element={<Locais/>}></Route>
      {/* <Route path="/dashboard" element={<Dashboard/>}></Route> */}
   </Routes>
  )
}

export default App
