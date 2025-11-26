import React from "react";
import { Link } from 'react-router-dom';

/**
 * Component for Navbar
 * @param {object} props
 * @param {function} props.onSigninClick
 */

const Navbar = ({ onSigninClick }) => {
  return (
    <header className="bg-(--primary-color) ">
      <div className="navbar flex justify-between items-center p-3">
        <Link to="/" className="nav-logo flex items-center">
          <i className="bx bxs-cup-hot text-white text-2xl"></i>{" "}
          <h2 className="ml-2.5 text-white text-2xl font-semibold">Cozy Club</h2>
        </Link>
        <ul className="flex items-center space-x-3  text-white" >
          <li className="nav-item">
            <Link to="/" className="nav-link">
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/about" className="nav-link">
              About
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/games" className="nav-link">
              Games
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/contact" className="nav-link">
              Contact
            </Link>
          </li>
          <li className="nav-item">
            <button
              className="nav-link btn"
              id="open-signin-btn"
              onClick={(e) => {
                e.preventDefault();
                if (onSigninClick) onSigninClick();
              }}
            >
              Sign In
            </button>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Navbar;
