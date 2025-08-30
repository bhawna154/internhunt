import React, { useEffect } from "react";

export default function Home() {

 useEffect(() => {
  const featureCards = document.querySelectorAll('.feature');
  featureCards.forEach(card => {
    const toggle = () => card.classList.toggle('active');
    card.addEventListener('click', toggle);
    card._cleanup = toggle;
  });
    


  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));



  return () => {
    featureCards.forEach(card => {
      card.removeEventListener('click', card._cleanup);
    });
    observer.disconnect();
  };
  }, []);

  return (
    <>
      <section className="hero">
        <video autoPlay muted loop playsInline className="hero-video">
          <source src="/assets/hero-bg.mp4" type="video/mp4" />
        </video>
        <div className="hero-content animate-on-scroll">
          <h1>Find Your Dream Job or Internship</h1>
          <p>Get matched based on your resume and skills</p>
        </div>
      </section>

      <section className="features">
        <div className="feature animate-on-scroll">
          <h3>🔍 Resume Analysis</h3>
          <p>AI scans and scores your resume in seconds.</p>
          <div className="feature-content">
            <p>Upload your resume and get instant feedback on formatting, keywords, and overall score.</p>
          </div>
        </div>

        <div className="feature animate-on-scroll">
          <h3>📄 Job Recommendations</h3>
          <p>Get matched with jobs based on your skills.</p>
          <div className="feature-content">
            <p>We analyze your strengths and suggest tailored job listings.</p>
          </div>
        </div>

        <div className="feature animate-on-scroll">
          <h3>📝 Resume Templates</h3>
          <p>Choose from ATS-friendly resume formats.</p>
          <div className="feature-content">
            <p>Download professionally designed templates optimized for ATS.</p>
          </div>
        </div>
      </section>

      <section className="about">
        <h2>About InternHunt</h2>
        <p>InternHunt is your intelligent job and internship search assistant…</p>
      </section>

      <section className="how-it-works">
        <h2>How It Works</h2>
        <ol style={{textAlign:'left', maxWidth:700, margin:'0 auto'}}>
          <li>Upload your resume.</li>
          <li>Our AI analyzes and scores your resume.</li>
          <li>We match you with suitable jobs or internships.</li>
          <li>Download resume templates if needed.</li>
        </ol>
      </section>

      <section className="cta">
        <h2>Ready to Launch Your Career?</h2>
        <p>Upload your resume and get started in seconds!</p>
        <a href="/upload" className="btn">Upload Resume</a>
      </section>

      <section className="contact">
        <h2>Contact Us</h2>
        <p>Email: <a href="mailto:support@InterHunt.in">support@InterHunt.in</a></p>
        <p>Instagram: <a href="https://instagram.com/InterHunt" target="_blank" rel="noreferrer">@InterHunt</a></p>
      </section>
    </>
  );
}
