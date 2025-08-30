import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();


  useEffect(() => {
    document.body.classList.add("login-page");
    return () => document.body.classList.remove("login-page");
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    alert("Login successful!");
    localStorage.removeItem("savedJobs");
    navigate("/upload");
  }

  return (
    <div className="form-container">
      <h2>Login</h2>
      <form id="loginForm" onSubmit={handleSubmit}>
        <input type="email" id="email" placeholder="Email" required />
        <input type="password" id="password" placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account? <a href="/signup">Sign up</a>
      </p>
    </div>
  );
}
