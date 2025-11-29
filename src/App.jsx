import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Hero from "./components/Hero";
import Contact from "./components/Contact";
import About from "./components/About";
import GamesMain from "./components/playground/GamesMain";
import Riddle from "./components/playground/games/theRiddle/Riddle";

import Navbar from "./components/Navbar";
import SignInModal from "./components/SignInModal";
import Account from "./components/Account";

import "./styles/style.css";

const App = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [user, setUser] = useState(null);

  // Check if was Login before or not
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const openModal = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);

  // Login sucess
  const handleLoginSuccess = (userData) => {
    setUser(userData);
    closeModal();
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/"; // Force Reload
  };

  return (
    <BrowserRouter>
      <div>
        <Navbar user={user} onSigninClick={openModal} />
        <Routes>
          {/* <Route path="/" element={<Hero />} /> */}
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/games" element={<GamesMain />} />
          <Route path="/games/riddle" element={<Riddle user={user} />} />
          <Route
            path="/account"
            element={
              user ? <Account onLogout={handleLogout} /> : <Navigate to="/" />
            }
          />
        </Routes>

        {/* <Hero /> */}
        <SignInModal
          isVisible={isModalVisible}
          onClose={closeModal}
          onLoginSuccess={handleLoginSuccess}
        />
      </div>
    </BrowserRouter>
  );
};

export default App;
