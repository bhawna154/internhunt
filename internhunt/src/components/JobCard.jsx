import React from "react";

export default function JobCard({ job, onSave, onApply }) {
  return (
    <div className="job-card">
      <div className="job-header">
        <img src={`/assets/company-${job.id % 5 + 1}.png`} className="company-logo" alt="company"/>
        <div className="job-info">
          <h3>{job.title}</h3>
          <p className="company">{job.company} • {job.location}</p>
        </div>
      </div>

      <p className="skills"><strong>Skills:</strong> {job.skills.join(", ")}</p>
      <p className="description">{job.description}</p>
      <p className="salary"><strong>Salary:</strong> {job.salary}</p>

      <div className="job-actions">
        <a href={job.applyLink} target="_blank" rel="noreferrer" className="apply-btn" onClick={(e)=>{ e.preventDefault(); onApply(job); }}>Apply Now</a>
        <button className="save-btn" onClick={() => onSave(job)}>⭐ Save</button>
      </div>
    </div>
  );
}
