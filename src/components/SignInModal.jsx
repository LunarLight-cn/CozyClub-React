import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const SigninModal = ({ isVisible, onClose, onLoginSuccess }) => {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);

  // State เUser Data
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Reset Form
  useEffect(() => {
    if (!isVisible) {
      setIsRegister(false);
      setUsername("");
      setPassword("");
      setConfirmPassword("");
      setShowPassword(false);
    }
  }, [isVisible]);

  // API -> Cloudflare Backend
  const handleAuth = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validation
    if (isRegister && password !== confirmPassword) {
      alert("Passwords do not match!");
      setIsLoading(false);
      return;
    }

    const endpoint = isRegister ? "/register" : "/login";

    try {
      console.log(`Sending request to ${API_URL}${endpoint}...`);

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        if (!isRegister) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));

          if (onLoginSuccess) onLoginSuccess(data.user);
        } else {
          alert("Registration Successful! Please Login.");
          setIsRegister(false);
        }
      }
    } catch (error) {
      console.error("Connection Error:", error);
      alert("Cannot connect to server. Make sure Backend is running!");
    } finally {
      setIsLoading(false);
    }
  };

  const getIconClass = (val, show) => {
    if (val.length === 0) return "bxs-lock";
    return show ? "bxs-eye-alt" : "bxs-eye-slash";
  };

  if (!isVisible) return null;

  return (
    <div id="signin-modal-backdrop" className={isVisible ? "is-visible" : ""}>
      <div className="wrapper">
        <span className="icon-close" onClick={onClose}>
          <i className="bx bxs-x"></i>
        </span>

        <form onSubmit={handleAuth}>
          <h1>{isRegister ? "Register" : "Sign In"}</h1>

          <div className="input-box">
            <input
              type="text"
              placeholder="Username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <i className="bx bxs-user"></i>
          </div>

          {/* Password Input */}
          <div className="input-box">
            <input
              type={showPassword && password.length > 0 ? "text" : "password"}
              placeholder="Password"
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (e.target.value.length === 0) setShowPassword(false);
              }}
            />
            <i
              className={`bx ${getIconClass(password, showPassword)}`}
              style={{ cursor: password.length > 0 ? "pointer" : "default" }}
              onClick={() => {
                if (password.length > 0) setShowPassword(!showPassword);
              }}
            ></i>
          </div>

          {isRegister && (
            <div className="input-box">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Confirm Password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <i className="bx bxs-lock-alt"></i>
            </div>
          )}

          {!isRegister && (
            <div className="remember-forgot flex justify-between text-sm my-4">
              <label>
                <input type="checkbox" className="mr-1" /> Remember me
              </label>
              <a href="#">Forgot Password?</a>
            </div>
          )}

          <button
            type="submit"
            className="btn"
            style={{
              marginTop: isRegister ? "20px" : "0",
              opacity: isLoading ? 0.7 : 1,
            }}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : isRegister ? "Register" : "Sign In"}
          </button>

          <div className="register-link">
            <p>
              {isRegister
                ? "Already have an account? "
                : "Don't have an account? "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setIsRegister(!isRegister);
                  setPassword("");
                  setConfirmPassword("");
                }}
              >
                {isRegister ? "Sign In" : "Register"}
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SigninModal;
