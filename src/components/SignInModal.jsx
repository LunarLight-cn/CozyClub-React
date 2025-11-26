import React, { useEffect, useState } from "react";

/**
 * Component for Modal Signin Form
 * @param {object} props
 * @param {boolean} props.isVisible
 * @param {function} props.onClose
 */

const SigninModal = ({ isVisible, onClose }) => {
  // Switching mode
  const [isRegister, setIsRegister] = useState(false);

  // State Password
  const [showPassword, setShowPassword] = useState(false);
  const [passwordValue, setPasswordValue] = useState("");

  // State Confirmation
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPasswordValue, setConfirmPasswordValue] = useState("");

  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = "hidden"; // Scroll lock
    } else {
      document.body.style.overflow = "auto"; // Scroll unlock
    }

    // Cleanup function
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) {
      setIsRegister(false);
      setPasswordValue("");
      setConfirmPasswordValue("");
      setShowPassword(false);
      setShowConfirmPassword(false);
    }
  }, [isVisible]);

  const getIconClass = (val, show) => {
    if (val.length === 0) return "bxs-lock";
    return show ? "bxs-eye-alt" : "bxs-eye-slash";
  };

  return (
    <div id="signin-modal-backdrop" className={isVisible ? "is-visible" : ""}>
      <div className="wrapper">
        <span className="icon-close" onClick={onClose}>
          <i className="bx bxs-x"></i>
        </span>
        <form action="">
          <h1>{isRegister ? "Register" : "Sign In"}</h1>

          {/* Username Input */}
          <div className="input-box">
            <input type="text" placeholder="Username" required />
            <i className="bx bxs-user"></i>
          </div>

          {/* Password Input */}
          <div className="input-box">
            <input
              type={
                showPassword && passwordValue.length > 0 ? "text" : "password"
              }
              placeholder="Password"
              required
              value={passwordValue}
              onChange={(e) => {
                setPasswordValue(e.target.value);
                if (e.target.value.length === 0) setShowPassword(false);
              }}
            />
            <i
              className={`bx ${getIconClass(passwordValue, showPassword)}`}
              style={{
                cursor: passwordValue.length > 0 ? "pointer" : "default",
              }}
              onClick={() => {
                if (passwordValue.length > 0) {
                  setShowPassword(!showPassword);
                }
              }}
            ></i>
          </div>

          {isRegister && (
            <div className="input-box">
              <input
                type={
                  showConfirmPassword && confirmPasswordValue.length > 0
                    ? "text"
                    : "password"
                }
                placeholder="Confirm Password"
                required
                value={confirmPasswordValue}
                onChange={(e) => {
                  setConfirmPasswordValue(e.target.value);
                  if (e.target.value.length === 0)
                    setShowConfirmPassword(false);
                }}
              />
              <i
                className={`bx ${getIconClass(
                  confirmPasswordValue,
                  showConfirmPassword
                )}`}
                style={{
                  cursor:
                    confirmPasswordValue.length > 0 ? "pointer" : "default",
                }}
                onClick={() => {
                  if (confirmPasswordValue.length > 0)
                    setShowConfirmPassword(!showConfirmPassword);
                }}
              ></i>
            </div>
          )}

          {/* Remember Me & Forgot Password */}
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
            style={{ marginTop: isRegister ? "20px" : "0" }}
          >
            {isRegister ? "Register" : "Sign In"}
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
                  setPasswordValue("");
                  setConfirmPasswordValue("");
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
