document.getElementById("resumeForm")?.addEventListener("submit", function (e) {
  e.preventDefault();
  const input = document.getElementById("resumeInput");
  const file = input.files[0];
  if (!file) {
    alert("Please upload a resume file (PDF or DOCX).");
    return;
  }

  const fileName = file.name.toLowerCase();

  const validPatterns = ["resume", "cv", "biodata"];
const isValid = validPatterns.some(pattern => fileName.includes(pattern));



  // Store message in localStorage to show on templates.html
  if (!isValid) {
    localStorage.setItem("resumeStatus", "invalid");
    window.location.href = "templates.html";
  } else {
    localStorage.setItem("resumeStatus", "valid");
    window.location.href = "results.html";
  }


});

// pop up message when the user uploads a resume
const input = document.getElementById("resumeInput");
input?.addEventListener("change", () => {
  alert(`Uploaded file: ${input.files[0].name}`);
});



document.getElementById("resumeForm")?.addEventListener("submit", function (e) {
  e.preventDefault();
  const input = document.getElementById("resumeInput");
  const file = input.files[0];
  if (!file) {
    alert("Please upload a resume file (PDF or DOCX).");
    return;
  }

  // Example: Let's simulate that resume has these skills
  const extractedSkills = ["JavaScript", "HTML", "CSS", "Python"];

  localStorage.setItem("userSkills", extractedSkills.join(","));

  const fileName = file.name.toLowerCase();
  const validPatterns = ["resume", "cv", "biodata"];
  const isValid = validPatterns.some(pattern => fileName.includes(pattern));

  if (!isValid) {
    localStorage.setItem("resumeStatus", "invalid");
    window.location.href = "templates.html";
  } else {
    localStorage.setItem("resumeStatus", "valid");
    window.location.href = "results.html";
  }
});
