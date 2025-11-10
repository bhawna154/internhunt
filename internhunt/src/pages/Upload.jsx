// fileName: Upload.jsx (FINAL Corrected Version)
import { useNavigate } from "react-router-dom";
import React, { useEffect } from "react";

export default function Upload() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check for login status
    if (!localStorage.getItem("currentUser")) {
      navigate("/login");
      return;
    }
    
    document.body.classList.add("upload-page");
    return () => document.body.classList.remove("upload-page");
  }, [navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    const input = document.getElementById("resumeInput");
    const file = input.files[0];

    // --- CRITICAL CHANGE: We rely on the browser's 'required' property now. ---
    // If the file is null/empty, the browser will stop here and show a warning.
    
    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return alert("File size exceeds 5MB limit.");
    }

    const formData = new FormData();
    formData.append("resume", file);

    try {
      // Clear previous results before new analysis
      localStorage.removeItem("resumeScore");
      localStorage.removeItem("matchedJobs"); 
      localStorage.removeItem("strengths");
      localStorage.removeItem("weaknesses");
      localStorage.removeItem("userSkills");

      // Send to server for analysis/validation
      const res = await fetch("http://127.0.0.1:5000/analyze", { method: "POST", body: formData });
      const data = await res.json();

      // CHECK: If server returned an error (e.g., Invalid File Format 400 status)
      if (res.status !== 200) {
        throw new Error(data.error || "Server error analyzing resume.");
      }
      
      // SUCCESS: Save data and navigate to results
      localStorage.setItem("resumeScore", data.score);
      localStorage.setItem("matchedJobs", JSON.stringify(data.matched_jobs || [])); 
      localStorage.setItem("strengths", JSON.stringify(data.strengths || []));
      localStorage.setItem("weaknesses", JSON.stringify(data.weaknesses || []));
      localStorage.setItem("userSkills", JSON.stringify(data.skills || []));

      navigate("/results"); 

    } catch (err) {
      console.error("Analysis Error:", err);
      
      // FAILURE: Catch the error (e.g., invalid file type) and send to Templates
      let userMessage = `Analysis Failed: ${err.message}`;
      
      if (err.message.includes("Invalid file format")) {
          userMessage = `Error: Please upload a valid .pdf or .docx resume.`;
      }
      
      alert(userMessage);
      navigate("/templates"); // Redirect to Templates for invalid/failed analysis
    }
  }

  return (
    <div className="container" style={{ maxWidth: "600px", margin: "50px auto", textAlign: "center" }}>
      <h1>Resume Analyzer</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', padding: '20px', border: '1px solid #555', borderRadius: '8px', backgroundColor: '#222' }}>
        {/* CRITICAL CHANGE: Added 'required' attribute back */}
        <input type="file" id="resumeInput" accept=".pdf,.docx" required style={{ padding: '10px', borderRadius: '4px', border: '1px solid #777', backgroundColor: '#444', color: 'white' }} />
        <button type="submit" style={{ padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Analyze Resume</button>
      </form>
      
      <div style={{ marginTop: '20px' }}>
        <button 
          onClick={() => navigate("/templates")} 
          style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          Go to Resume Builder & Templates
        </button>
      </div>
    </div>
  );
}