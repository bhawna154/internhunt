import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  useEffect(() => {
    document.body.classList.add("signup-page");
    return () => document.body.classList.remove("signup-page");
  }, []);

  async function registerUser(e) {
    e.preventDefault();
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    try {
      const res = await fetch("http://127.0.0.1:5000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      setMessage("✅ Signup successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    }
  }

  return (
    <div className="form-container">
      <h2>Create Account</h2>
      <form onSubmit={registerUser}>
        <input type="text" id="name" placeholder="Full Name" required />
        <input type="email" id="email" placeholder="Email" required />
        <input type="password" id="password" placeholder="Password" required />
        <button type="submit">Signup</button>
      </form>
      {message && <p className="form-message">{message}</p>}
      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}
