import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { auth } from "./api/firebase-config";
import { onAuthStateChanged, signOut } from "firebase/auth";

import Header from "./general/Header";
import Login from "./pages/user/Login";
import Register from "./pages/user/Register";
import ChangePassword from "./pages/user/Change-password";
import Home from "./pages/home/Home";
import ProtectedRoute from "./pages/components/ProtectedRoute";
import HomePage from "./pages/home/HomePage";
import NotFoundPage from "./general/NotFoundPage";
import AddItem from "./pages/products/addItem";
import Items from "./pages/products/Items";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser({
          displayName: currentUser.displayName,
          email: currentUser.email,
        });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const onLogout = () => {
    signOut(auth)
      .then(() => {
        setUser(null);
        localStorage.removeItem("userToken");
      })
      .catch((error) => {
        console.error("Error al cerrar sesión:", error.message);
      });
  };

  return (
    <Router>
      <Header userName={user?.displayName} onLogout={onLogout} />
      <div>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-item"
            element={
              <ProtectedRoute>
                <AddItem />
              </ProtectedRoute>
            }
          />
          <Route
            path="/items"
            element={
              <ProtectedRoute>
                <Items />
              </ProtectedRoute>
            }
          />
          <Route
            path="/change-password"
            element={
              <ProtectedRoute>
                <ChangePassword />
              </ProtectedRoute>
            }
          />
          <Route
            userName={user?.displayName}
            path="*"
            element={<NotFoundPage />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
