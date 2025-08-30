
import { useNavigate } from "react-router-dom";
import React, { useEffect } from "react";

export default function Templates(){
  const navigate = useNavigate();
 useEffect(() => {
    document.body.classList.add("templates-page");
    return () => document.body.classList.remove("templates-page");
  }, []);
  function redirectToUpload(){ navigate("/upload"); }

  function generateDocx(){
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const location = document.getElementById("location").value.trim();
    const linkedin = document.getElementById("linkedin").value.trim();
    const summary = document.getElementById("summary").value.trim();
    const experience = document.getElementById("experience").value.trim();
    const education = document.getElementById("education").value.trim();
    const skills = document.getElementById("skills").value.trim();
    const certifications = document.getElementById("certifications").value.trim();

    if (!name || !email || !phone) {
      alert("Name, Email, and Phone are required fields!");
      return;
    }

    const skillsList = skills.split(',').map(s => `<li>${s.trim()}</li>`).join('');

    const resumeHTML = `
      <div class="resume-content">
        <div class="resume-header">
          <h2>${name}</h2>
          <p class="contact-info">${location} | ${email} | ${phone} | ${linkedin}</p>
        </div>
        ${summary ? `<div class="section"><p class="section-title">Professional Summary</p></div><p class="section-content">${summary}</p>` : ''}
        ${experience ? `<div class="section"><p class="section-title">Work Experience</p></div><p class="section-content">${experience}</p>` : ''}
        ${education ? `<div class="section"><p class="section-title">Education</p></div><p class="section-content">${education}</p>` : ''}
        ${skills ? `<div class="section"><p class="section-title">Skills</p></div><ul class="skills-list">${skillsList}</ul>` : ''}
        ${certifications ? `<div class="section"><p class="section-title">Certifications</p></div><p class="section-content">${certifications}</p>` : ''}
      </div>
    `;

    // preview
    document.getElementById("resumeContent").innerHTML = resumeHTML;
    document.getElementById("resumePreview").style.display = "block";

    const blob = window.htmlDocx.asBlob(resumeHTML);
    window.saveAs(blob, `${name.replace(/\s+/g, "_")}_Resume.docx`);
  }

  return (
    <div className="container">
      <div className="warning-box">
        <h2>Unsupported Resume Format</h2>
        <p id="templateMessage">Your uploaded resume is missing important information...</p>
      </div>

      <div className="templates">
        <div className="template">
          <a href="/assets/templates/templateA.docx" download>Download Template A (DOCX)</a>
          <button onClick={redirectToUpload}>Select & Continue</button>
        </div>
        <div className="template">
          <a href="/assets/templates/templateB.docx" download>Download Template B (DOCX)</a>
          <button onClick={redirectToUpload}>Select & Continue</button>
        </div>
      </div>

      <hr/>

      <h2>Don’t have a Resume? Create one here 👇</h2>

      <form id="resumeBuilderForm">
        <label>Full Name</label><input id="name" />
        <label>Email</label><input id="email" />
        <label>Phone</label><input id="phone" />
        <label>Location</label><input id="location" />
        <label>LinkedIn</label><input id="linkedin" />
        <label>Professional Summary</label><textarea id="summary" />
        <label>Work Experience</label><textarea id="experience" />
        <label>Education</label><textarea id="education" />
        <label>Skills</label><textarea id="skills" />
        <label>Certifications</label><textarea id="certifications" />
        <button type="button" onClick={generateDocx}>Download Resume (DOCX)</button>
      </form>

      <div id="resumePreview" style={{display:"none", marginTop:30}}>
        <h3>Generated Resume Preview</h3>
        <div id="resumeContent" style={{whiteSpace:"pre-line"}}></div>
        <button id="downloadResume" onClick={()=>{
          const content = document.getElementById("resumeContent");
          window.html2pdf().from(content).save("My_Resume.pdf");
        }}>Download Resume (PDF)</button>
      </div>
    </div>
  );
}
