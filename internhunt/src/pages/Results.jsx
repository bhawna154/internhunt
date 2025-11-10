// fileName: Results.jsx (FINAL FIX for Login Loop)
import React, { useEffect, useState } from "react"; 
import { useNavigate } from "react-router-dom";
// Path is assumed to be correct now:
import { saveOrUnsaveJob } from "../utils/api"; 

export default function Results() {
    const navigate = useNavigate();
    
    // --- Data Extraction ---
    const score = localStorage.getItem("resumeScore") || "N/A";
    const strengths = JSON.parse(localStorage.getItem("strengths") || "[]");
    const weaknesses = JSON.parse(localStorage.getItem("weaknesses") || "[]");
    const skills = JSON.parse(localStorage.getItem("userSkills") || "[]");
    const matchedJobs = JSON.parse(localStorage.getItem("matchedJobs") || "[]");
    
    const currentUserData = localStorage.getItem("currentUser");
    let userId = null;
    
    if (currentUserData) {
        try {
            const currentUser = JSON.parse(currentUserData);
            // Check if the structure {user: {id: ...}} exists
            if (currentUser.user && currentUser.user.id) {
                userId = currentUser.user.id;
            }
        } catch (e) {
            console.error("Error parsing currentUser data:", e);
        }
    }
    
    const [isJobSaved, setIsJobSaved] = useState({}); 

    useEffect(() => {
        if (!userId) {
            console.log("No valid user ID found in localStorage. Redirecting to login.");
            navigate("/login");
            return;
        }
        
        document.body.classList.add("results-page");
        return () => document.body.classList.remove("results-page");
    }, [navigate, userId]);

    const handleSaveClick = async (job) => {
        if (!userId) {
            alert("Login required to save jobs.");
            navigate("/login");
            return;
        }

        const result = await saveOrUnsaveJob(userId, job);

        if (result.success) {
            alert(result.message);
            // State update karein
            setIsJobSaved(prev => ({
                ...prev,
                [job.id]: result.action === 'saved' 
            }));
        } else {
            alert(`Failed to save/remove job: ${result.message}`);
        }
    };

    return (
        <div className="container" style={{ maxWidth: "800px", margin: "50px auto", padding: "20px", background: "#2c3e50", borderRadius: "10px", color: "white" }}>
            <h1 style={{ textAlign: "center", color: "#2ecc71" }}>Resume Analysis Results 🏆</h1>

            {/* SCORE SECTION, Strengths, Weaknesses, Skills (UNCHANGED) */}
            <div style={{ padding: "15px", margin: "20px 0", border: "1px solid #34495e", borderRadius: "5px", background: "#34495e" }}>
                <h2 style={{ color: "#ecf0f1" }}>Overall Score: <span style={{ float: "right", color: score >= 75 ? "#2ecc71" : "#e74c3c" }}>{score}/100</span></h2>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", gap: "20px" }}>
                
                {/* Strengths */}
                <div style={{ flex: 1, padding: "15px", border: "1px solid #2ecc71", borderRadius: "5px", background: "#1e3040" }}>
                    <h3 style={{ color: "#2ecc71" }}>Strengths ✅</h3>
                    <ul style={{ listStyleType: "disc", paddingLeft: "20px" }}>
                        {strengths.length > 0 ? (
                            strengths.map((item, index) => <li key={index}>{item}</li>)
                        ) : (
                            <li>No specific strengths identified.</li>
                        )}
                    </ul>
                </div>

                {/* Weaknesses */}
                <div style={{ flex: 1, padding: "15px", border: "1px solid #e74c3c", borderRadius: "5px", background: "#1e3040" }}>
                    <h3 style={{ color: "#e74c3c" }}>Weaknesses ❌</h3>
                    <ul style={{ listStyleType: "disc", paddingLeft: "20px" }}>
                        {weaknesses.length > 0 ? (
                            weaknesses.map((item, index) => <li key={index}>{item}</li>)
                        ) : (
                            <li>No specific weaknesses identified.</li>
                        )}
                    </ul>
                </div>
            </div>
            
            {/* Skills */}
            <div style={{ marginTop: "20px", padding: "15px", border: "1px solid #f39c12", borderRadius: "5px", background: "#34495e" }}>
                <h3 style={{ color: "#f39c12" }}>Extracted Skills 🧠</h3>
                <p>{skills.join(' | ') || "No skills extracted."}</p>
            </div>
            
            {/* ----------------- MATCHED JOBS SECTION ----------------- */}
            <div style={{ marginTop: "30px", padding: "20px", border: "2px solid #2ecc71", borderRadius: "10px", background: "#1f2a38" }}>
                <h2 style={{ textAlign: "center", color: "#2ecc71" }}>Matched Jobs for Your Skills 💼</h2>
                
                {matchedJobs.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#ccc' }}>No relevant jobs found based on your skills.</p>
                ) : (
                    matchedJobs.map((job) => (
                        <div key={job.id} style={{ 
                            border: '1px solid #34495e', 
                            borderRadius: '8px', 
                            padding: '15px', 
                            margin: '15px 0', 
                            background: '#2c3e50',
                            position: 'relative'
                        }}>
                            <h3 style={{ margin: '0 0 5px 0', color: '#f39c12' }}>{job.title}</h3>
                            <p style={{ margin: '0 0 10px 0', color: '#bdc3c7', fontSize: '14px' }}>{job.company} • {job.location}</p>
                            <p style={{ margin: '0', fontSize: '14px' }}>**Skills Required:** {job.skills.join(', ')}</p>
                            <p style={{ marginTop: '10px', color: '#2ecc71', fontWeight: 'bold' }}>Salary: {job.salary}</p>
                            
                            {/* The NEW Save Button */}
                            <button 
                                onClick={() => handleSaveClick(job)}
                                style={{ 
                                    padding: '8px 15px', 
                                    background: isJobSaved[job.id] ? '#e74c3c' : '#3498db', // Red if saved
                                    color: 'white', 
                                    border: 'none', 
                                    borderRadius: '5px', 
                                    cursor: 'pointer',
                                    marginTop: '10px'
                                }}
                            >
                                {isJobSaved[job.id] ? 'Saved! Click to Unsave' : '⭐ Save Job'}
                            </button>
                            
                            {/* Apply Now button */}
                            <a 
                                href={job.apply_link} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                style={{ 
                                    marginLeft: '10px',
                                    padding: '8px 15px', 
                                    background: '#2ecc71',
                                    color: 'white', 
                                    textDecoration: 'none',
                                    borderRadius: '5px' 
                                }}
                            >
                                Apply Now
                            </a>
                        </div>
                    ))
                )}
            </div>

            {/* ----------------- BUTTONS SECTION ----------------- */}
            <div style={{ textAlign: "center", marginTop: "30px" }}>
                <button 
                    onClick={() => navigate("/upload")} 
                    style={{ padding: "10px 20px", marginRight: "10px", background: "#3498db", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}
                >
                    Analyze Another Resume
                </button>
                <button 
                    onClick={() => navigate("/templates")} 
                    style={{ padding: "10px 20px", background: "#e67e22", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}
                >
                    Improve/Use Templates
                </button>
            </div>
        </div>
    );
}