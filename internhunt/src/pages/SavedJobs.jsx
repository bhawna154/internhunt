import React, { useEffect, useState } from "react";

// --- API Utility Function (Assume this is defined somewhere and imported) ---
// Since I don't have your full project structure, I will define the fetch function here
// You should move this function to a file like 'src/utils/api.js' later.
const API_BASE_URL = 'http://localhost:5000'; 

async function fetchSavedJobs(userId) {
    if (!userId) return [];
    
    try {
        const url = `${API_BASE_URL}/get_saved_jobs?user_id=${userId}`;
        const response = await fetch(url);
        const result = await response.json();

        if (result.success) {
            return result.saved_jobs;
        } else {
            console.error("Failed to fetch saved jobs:", result.message);
            return [];
        }

    } catch (error) {
        console.error("Error fetching saved jobs from API:", error);
        return [];
    }
}
// --------------------------------------------------------------------------

export default function SavedJobs(){
    const [savedJobs, setSavedJobs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // 💡 IMPORTANT: Replace this with the actual logged-in user's ID.
    // This ID should be stored in global state, context, or localStorage after login.
    const currentUserId = localStorage.getItem('user_id') || '1'; 
    // We are using '1' as a temporary fallback, but use the real ID in production!

    useEffect(() => {
        if (!currentUserId || currentUserId === '1') {
             // Handle case where user is not logged in or ID is invalid
             setIsLoading(false);
             return;
        }

        async function loadSavedJobs() {
            setIsLoading(true);
            const savedList = await fetchSavedJobs(currentUserId);
            setSavedJobs(savedList);
            setIsLoading(false);
        }

        loadSavedJobs();
    }, [currentUserId]); // Dependency array ensures it runs when user ID is available

    if (isLoading) {
        return (
             <section className="jobs-section">
                <h2>⭐ Your Saved Jobs</h2>
                <p style={{color:'white', textAlign:'center', marginTop: '20px'}}>Loading saved jobs from the server...</p>
             </section>
        );
    }
    
    return (
        <section className="jobs-section">
            <h2>⭐ Your Saved Jobs</h2>
            <div id="savedJobsContainer">
                {savedJobs.length === 0 ? (
                    <p style={{color:'white', textAlign:'center'}}>No saved jobs yet. Go to the results page and save some!</p>
                ) : (
                    savedJobs.map(job => (
                        <div className="job-card" key={job.id}>
                            <div className="job-header">
                                {/* Note: Assuming job.id is a number or unique string for the logo logic */}
                                <img src={`/assets/company-${job.id % 5 + 1}.png`} className="company-logo" alt="" />
                                <div className="job-info">
                                    <h3>{job.title}</h3>
                                    <p className="company">{job.company} • {job.location}</p>
                                </div>
                            </div>
                            {/* Skills are a placeholder array from the backend */}
                            <p className="skills">
                                <strong>Skills:</strong> {job.skills.join(", ")}
                            </p>
                            {/* Note: Backend does not store full description, removed description tag */}
                            <p className="salary"><strong>Salary:</strong> {job.salary}</p>
                            <div className="job-actions">
                                <a href={job.apply_link} target="_blank" rel="noreferrer" className="apply-btn">Apply Now</a>
                                {/* You might want an "Unsave" button here */}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </section>
    );
}