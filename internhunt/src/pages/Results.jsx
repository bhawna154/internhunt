import React, { useEffect, useState } from "react";
import JobCard from "../components/JobCard";

export default function Results(){

    useEffect(() => {
    document.body.classList.add("results-page");
    return () => document.body.classList.remove("results-page");
  }, []);
  
  const [jobs, setJobs] = useState([]);
  const [matched, setMatched] = useState([]);

  useEffect(() => {
    fetch("/data/jobs.json")
      .then(r => r.json())
      .then(data => setJobs(data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (jobs.length === 0) return;
    const stored = localStorage.getItem("userSkills") || "";
    const userSkills = stored.split(",").map(s => s.trim().toLowerCase()).filter(Boolean);

    let matchedJobs = [];
    if(userSkills.length > 0){
      matchedJobs = jobs.filter(job => job.skills.some(skill => userSkills.includes(skill.toLowerCase())));
    }
    if(matchedJobs.length === 0) matchedJobs = jobs; 
    setMatched(matchedJobs);
  }, [jobs]);

  function handleSave(job){
    const savedJobs = JSON.parse(localStorage.getItem("savedJobs")) || [];
    if(!savedJobs.some(j => j.id === job.id)){
      savedJobs.push(job);
      localStorage.setItem("savedJobs", JSON.stringify(savedJobs));
      alert("Job saved successfully!");
    } else alert("Job already saved!");
  }

  function handleApply(job){
    // your behavior: show alert and do not actually open new tab
    alert("Application submitted successfully! Your resume has been sent.");
  }

  return (
    <section className="jobs-section">
      <h2>Recommended Jobs</h2>
      <div id="jobsList">
        {matched.map(job => (
          <JobCard key={job.id} job={job} onSave={handleSave} onApply={handleApply} />
        ))}
        {matched.length === 0 && <p style={{color:'white'}}>Loading jobs...</p>}
      </div>
    </section>
  );
}
