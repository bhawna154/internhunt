import { useNavigate } from "react-router-dom";
import React, { useEffect } from "react";

export default function Templates() {
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add("templates-page");
    return () => document.body.classList.remove("templates-page");
  }, []);

  function redirectToUpload() {
    navigate("/upload");
  }

  function generateDocx(e) {
    e.preventDefault();

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

    const skillsList = skills
      ? skills.split(",").map((s) => `<li>${s.trim()}</li>`).join("")
      : "";

    const resumeHTML = `
      <div class="resume-content">
        <div class="resume-header">
          <h2>${name}</h2>
          <p class="contact-info">${location} | ${email} | ${phone} | ${linkedin}</p>
        </div>

        ${summary ? `
          <div class="section">
            <p class="section-title">Professional Summary</p>
            <p class="section-content">${summary}</p>
          </div>` : ""}

        ${experience ? `
          <div class="section">
            <p class="section-title">Work Experience</p>
            <p class="section-content">${experience}</p>
          </div>` : ""}

        ${education ? `
          <div class="section">
            <p class="section-title">Education</p>
            <p class="section-content">${education}</p>
          </div>` : ""}

        ${skills ? `
          <div class="section">
            <p class="section-title">Skills</p>
            <ul class="skills-list">${skillsList}</ul>
          </div>` : ""}

        ${certifications ? `
          <div class="section">
            <p class="section-title">Certifications</p>
            <p class="section-content">${certifications}</p>
          </div>` : ""}
      </div>
    `;

    // Preview
    document.getElementById("resumeContent").innerHTML = resumeHTML;
    document.getElementById("resumePreview").style.display = "block";

    // Generate DOCX file
    const blob = window.htmlDocx.asBlob(resumeHTML);
    window.saveAs(blob, `${name.replace(/\s+/g, "_")}_Resume.docx`);
  }

  return (
    <div className="container">
      <div className="warning-box">
        <h2>Unsupported Resume Format</h2>
        <p id="templateMessage">
          Your uploaded resume is missing important information...
        </p>
      </div>

      {/* Templates Section */}
      <div className="templates">
        <div className="template">
          <h3>Template 1</h3>
          <a href="/templates/templateA.docx" download>
            Download Template 1
          </a>
          <button onClick={redirectToUpload}>Select & Continue</button>
        </div>
        <div className="template">
          <h3>Template 2</h3>
          <a href="/templates/templateB.docx" download>
            Download Template 2
          </a>
          <button onClick={redirectToUpload}>Select & Continue</button>
        </div>
        <div className="template">
          <h3>Template 3</h3>
          <a href="/templates/templateC.docx" download>
            Download Template 3
          </a>
          <button onClick={redirectToUpload}>Select & Continue</button>
        </div>
      </div>

      <hr />

      {/* Resume Builder Form */}
      <h2>Don’t have a Resume? Create one here 👇</h2>

      <form id="resumeBuilderForm" onSubmit={generateDocx}>
        <label>Full Name</label>
        <input type="text" id="name" placeholder="Enter your full name" required />

        <label>Email</label>
        <input type="email" id="email" placeholder="Enter your email" required />

        <label>Phone</label>
        <input type="tel" id="phone" placeholder="10-digit phone number" required />

        <label>Location</label>
        <input type="text" id="location" placeholder="City, Country" />

        <label>LinkedIn</label>
        <input type="text" id="linkedin" placeholder="LinkedIn Profile URL" />

        <label>Summary</label>
        <textarea id="summary" placeholder="Short professional summary" />

        <label>Experience</label>
        <textarea id="experience" placeholder="Work experience details" />

        <label>Education</label>
        <textarea id="education" placeholder="Your education details" />

        <label>Skills</label>
        <input type="text" id="skills" placeholder="e.g. Java, Python, React" />

        <label>Certifications</label>
        <textarea id="certifications" placeholder="Your certifications" />

        <button type="submit">Generate Resume (Word)</button>
      </form>

      {/* Preview + PDF Download */}
      <div id="resumePreview" style={{ display: "none", marginTop: 30 }}>
        <h3>Generated Resume Preview</h3>
        <div id="resumeContent" style={{ whiteSpace: "pre-line" }}></div>
        <button
          id="downloadResume"
          onClick={() => {
            const content = document.getElementById("resumeContent");
            window.html2pdf().from(content).save("My_Resume.pdf");
          }}
        >
          Download Resume (PDF)
        </button>
      </div>
    </div>
  );
}
