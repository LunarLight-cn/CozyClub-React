import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Hero from './components/Hero';
import Contact from './components/Contact';
import About from './components/About';
import GamesMain from './components/playground/GamesMain'

import Navbar from './components/Navbar';
import SignInModal from './components/SignInModal';

import '../src/styles/style.css';


const App = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const openModal = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);

  return (
    <BrowserRouter>
      <div>
        <Navbar onSigninClick={openModal} />
        <Routes>
          {/* <Route path="/" element={<Hero />} /> */}
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/games" element={<GamesMain />} />
        </Routes>

        {/* <Hero /> */}
        <SignInModal isVisible={isModalVisible} onClose={closeModal} />
      </div>
    </BrowserRouter>
  );
};

export default App;
