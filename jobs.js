const jobsContainer = document.querySelector(".jobs-section");

// Get user skills from localStorage (comma-separated string)
const storedSkills = localStorage.getItem("userSkills") || "";
const userSkills = storedSkills.split(",").map(skill => skill.trim().toLowerCase());

fetch("./data/jobs.json")
  .then(response => response.json())
  .then(jobs => {
    // Filter jobs matching any of the user's skills
    const matchedJobs = jobs.filter(job =>
      job.skills.some(skill => userSkills.includes(skill.toLowerCase()))
    );

    if (matchedJobs.length === 0) {
      jobsContainer.innerHTML = "<p style='color:white;'>No jobs matched your skills. Please try uploading a different resume.</p>";
      return;
    }

    matchedJobs.forEach(job => addJobCard(job));
  })
  .catch(error => {
    console.error("Error fetching jobs:", error);
    jobsContainer.innerHTML = "<p style='color:white;'>Error loading jobs.</p>";
  });

function addJobCard(job) {
  const div = document.createElement("div");
  div.className = "job-card";
  div.innerHTML = `
    <h3>${job.title}</h3>
    <p><strong>Company:</strong> ${job.company}</p>
    <p><strong>Location:</strong> ${job.location}</p>
    <p><strong>Skills Required:</strong> ${job.skills.join(", ")}</p>
    <p>${job.description}</p>
    <a href="${job.applyLink}">Apply Now</a>
  `;
  jobsContainer.append(div);
}
