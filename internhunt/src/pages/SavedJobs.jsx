import React, { useEffect, useState } from "react";

export default function SavedJobs(){
  const [savedJobs, setSavedJobs] = useState([]);

  useEffect(() => {
    const s = JSON.parse(localStorage.getItem("savedJobs")) || [];
    setSavedJobs(s);
  }, []);

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
                <img src={`/assets/company-${job.id % 5 + 1}.png`} className="company-logo" alt="" />
                <div className="job-info">
                  <h3>{job.title}</h3>
                  <p className="company">{job.company} • {job.location}</p>
                </div>
              </div>
              <p className="skills"><strong>Skills:</strong> {job.skills.join(", ")}</p>
              <p className="description">{job.description}</p>
              <p className="salary"><strong>Salary:</strong> {job.salary}</p>
              <div className="job-actions">
                <a href={job.applyLink} target="_blank" rel="noreferrer" className="apply-btn">Apply Now</a>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
