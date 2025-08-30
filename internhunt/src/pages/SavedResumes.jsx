import React from "react";

export default function SavedResumes() {
  const storedResume = localStorage.getItem("uploadedResume");

  if (!storedResume) {
    return <p>No resume uploaded yet.</p>;
  }

  return (
    <div style={{textAlign:"center", marginTop:"50px"}}>
      <h2>Saved Resume</h2>
      <iframe 
        src={storedResume} 
        width="80%" 
        height="500px" 
        title="resume-preview"
        style={{border:"1px solid #ccc", borderRadius:"8px"}}
      ></iframe>
      <br />
      <a href={storedResume} download="resume.pdf">
        <button style={{marginTop:"20px"}}>Download Resume</button>
      </a>
    </div>
  );
}
