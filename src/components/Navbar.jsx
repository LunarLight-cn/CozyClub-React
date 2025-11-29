import React from "react";
import { Link } from "react-router-dom";

/**
 * Component for Navbar
 * @param {object} props
 * @param {function} props.onSigninClick
 */

const Navbar = ({ user, onSigninClick }) => {
  return (
    <header className="bg-[#3b141c] relative z-50">
      <div className="navbar flex justify-between items-center p-3">
        <Link to="/" className="nav-logo flex items-center">
          <i className="bx bxs-cup-hot text-white text-2xl"></i>{" "}
          <h2 className="ml-2.5 text-white text-2xl font-semibold">
            Cozy Club
          </h2>
        </Link>
        <ul className="flex items-center space-x-3  text-white">
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
            {user ? (
              // if alr Login -> Account
              <Link to="/account">
                <button className="nav-link btn flex items-center gap-2 bg-[#f3961c] text-white hover:bg-[#d88210]">
                  <i className="bx bxs-user-circle text-xl"></i>
                  Account
                </button>
              </Link>
            ) : (
              // if not Login -> Sign In
              <button
                className="nav-link btn"
                onClick={(e) => {
                  e.preventDefault();
                  onSigninClick();
                }}
              >
                Sign In
              </button>
            )}
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Navbar;
