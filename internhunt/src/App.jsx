import React from "react";
import { Routes, Route } from "react-router-dom";

import "./styles/style.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Upload from "./pages/Upload";
import Results from "./pages/Results";
import SavedJobs from "./pages/SavedJobs";
import Templates from "./pages/Templates";
import SavedResumes from "./pages/SavedResumes";

function App() {
  return (
    <>
      <Navbar />
      <main style={{ marginTop: "70px" }}> {/* leave room for fixed navbar */}
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login/>} />
          <Route path="/signup" element={<Signup/>} />
          <Route path="/upload" element={<Upload/>} />
          <Route path="/results" element={<Results/>} />
          <Route path="/saved-jobs" element={<SavedJobs/>} />
          <Route path="/templates" element={<Templates/>} />
          <Route path="/saved-resumes" element={<SavedResumes />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
