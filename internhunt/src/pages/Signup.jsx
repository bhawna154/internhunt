
import { useNavigate } from "react-router-dom";
import React, { useEffect } from "react";

export default function Signup(){
  const navigate = useNavigate();


  useEffect(() => {
    document.body.classList.add("signup-page");
    return () => document.body.classList.remove("signup-page");
  }, []);


  function registerUser(e){
    e.preventDefault();
    alert("Registration successful");
    navigate("/login");
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
      <p>Already have an account? <a href="/login">Login</a></p>
    </div>
  );
}
