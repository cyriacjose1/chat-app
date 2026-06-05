import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login"; 
import Register from "../pages/Register";



function Dashboard() {
  return <h2>Dashboard</h2>; 
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}