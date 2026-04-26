import { Routes, Route, Navigate } from "react-router-dom";

import ListBooks from "./Books/ListBooks";
import ViewBook from "./Books/ViewBook";
import CreateBook from "./Books/CreateBook";
import Register from "./Users/Register";
import Login from "./Users/Login";
import Profile from "./Users/Profile";
import Layout from "./navbar/Layout";

// Auth check
const isAuthenticated = () => {
  return localStorage.getItem("token");
};

// Route protégée
const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Routes>
      {/* Redirection par défaut */}
      <Route path="/" element={<Navigate to="/login" />} />

      {/* Public */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* 🔥 Layout protégé */}
      <Route
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route path="/books" element={<ListBooks />} />
        <Route path="/books/:id" element={<ViewBook />} />
        <Route path="/create" element={<CreateBook />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}

export default App;