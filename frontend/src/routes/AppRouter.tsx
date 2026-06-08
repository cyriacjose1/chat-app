import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login"; 
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import Users from "../pages/Users";
import Conversation from "../pages/Conversation";
import Conversations from "../pages/Conversations";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
        <Route path="/conversations" element={<ProtectedRoute><Conversations /></ProtectedRoute>} />
        <Route path="/conversations/:id" element={<ProtectedRoute><Conversation /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}