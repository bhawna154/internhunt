
import { useNavigate } from "react-router-dom";
import React, { useEffect } from "react";

export default function Upload(){
  const navigate = useNavigate();
  useEffect(() => {
    document.body.classList.add("upload-page");
    return () => document.body.classList.remove("upload-page");
  }, []);

  async function handleSubmit(e){
    e.preventDefault();
    const input = document.getElementById("resumeInput");
    const file = input.files[0];
    if(!file) return alert("Upload a resume file.");
  const reader = new FileReader();
  reader.onload = () => {
    localStorage.setItem("uploadedResume", reader.result);
    console.log("Resume stored in localStorage ✅");
  };
  reader.readAsDataURL(file);
    let resumeText = "";

    try {
      // PDF parsing using global pdfjs
      if (file.type === "application/pdf") {
        const loadingTask = window.pdfjsLib.getDocument(URL.createObjectURL(file));
        const pdf = await loadingTask.promise;
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          resumeText += textContent.items.map(item => item.str).join(" ") + " ";
        }
      }
      // DOCX parsing using global mammoth
      else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        const reader = new FileReader();
        resumeText = await new Promise((resolve, reject) => {
          reader.onload = async (ev) => {
            try {
              const result = await window.mammoth.extractRawText({arrayBuffer: ev.target.result});
              resolve(result.value);
            } catch(err){ reject(err); }
          };
          reader.onerror = (err) => reject(err);
          reader.readAsArrayBuffer(file);
        });
      } else {
        alert("Only PDF or DOCX allowed.");
        return;
      }

      // Validation
      if (!isResumeContent(resumeText)) {
        localStorage.setItem("resumeStatus","invalid");
        navigate("/templates");
        return;
      }

      const skills_keywords = ["python","java","c++","javascript","html","css","sql","excel","machine learning","data analysis","nlp","deep learning","flask","django","react","node.js"];
      const foundSkills = skills_keywords.filter(s => resumeText.toLowerCase().includes(s));

      localStorage.setItem("userSkills", foundSkills.join(","));
      localStorage.setItem("resumeStatus","valid");
      navigate("/results");

    } catch(err) {
      console.error(err);
      alert("Error reading resume.");
    }
  }

  function isResumeContent(text) {
    const lowerText = text.toLowerCase();
    const keywords = [/experience/,/education/,/skills/,/projects/,/summary/,/professional/,/certifications/];
    const invalid = ["item","qty","invoice","total"];
    if (lowerText.length < 200) return false;
    let keywordCount = 0;
    keywords.forEach(k => { if (k.test(lowerText)) keywordCount++; });
    const hasInvalid = invalid.some(w => lowerText.includes(w));
    const hasEmail = /\S+@\S+\.\S+/.test(lowerText);
    const hasPhone = /\d{10,}/.test(lowerText);
    return (keywordCount >= 2 && !hasInvalid && (hasEmail || hasPhone));
  }

  return (
    <div className="container">
      <h2>Upload Your Resume (PDF or DOCX)</h2>
      <p>Your resume should include: Skills, Education, Projects, and Experience.</p>

      <form id="resumeForm" onSubmit={handleSubmit}>
        <input type="file" id="resumeInput" accept=".pdf,.docx" required />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
