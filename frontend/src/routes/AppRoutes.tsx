import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./../components/layout/ProtectedRoute";

import Login from "./../pages/Login";
import Dashboard from "./../pages/Dashboard";
import Users from "./../pages/Users";
import Explore from "./../pages/Explore";
import NotFound from "@/pages/NotFound";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <Users />
          </ProtectedRoute>
        }
      />
      <Route
        path="/explore"
        element={
          <ProtectedRoute>
            <Explore />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound backToLink="/" />} />
    </Routes>
  );
}
