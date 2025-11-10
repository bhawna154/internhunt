# fileName: app.py (FINAL AI + REAL JOB INTEGRATION)  - Resume Analyzer Backend
from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash
import random 
import os
import io
import requests 
from google import genai
from pdfminer.high_level import extract_text_to_fp
from docx import Document
from pdfminer.layout import LAParams
import json 


GEMINI_API_KEY = "AIzaSyCEXGEd8XksCB2lO5vgWvGvAtxWSry8GHA" 
client = genai.Client(api_key=GEMINI_API_KEY)

JOB_API_KEY = "fecdd1c929msh4e7e7e3962a8bf3p1e0d25jsn00157ac2bc08"

JOB_API_HOST = "job-search-api.p.rapidapi.com"


app = Flask(__name__)
CORS(app) 

def get_real_jobs_from_api(skills):
    """Fetches real job listings based on extracted skills, or uses a fallback query."""
    
    

    # 1. Configuration 
    JOB_API_HOST = "jsearch.p.rapidapi.com"  # ✅ Updated host
    JOB_API_KEY = "fecdd1c929msh4e7e7e3962a8bf3p1e0d25jsn00157ac2bc08"

    # 2. Prepare queries
    query = " OR ".join(skills) if skills else "Software Developer"
    queries_to_try = [
        query,
        "Python OR SQL OR Data Analyst",
        "Remote job OR Work from home"
    ]
    
    for current_query in queries_to_try:
        # NOTE: The URL and Host might conflict. Using the explicit endpoint URL here.
        url = "https://jsearch.p.rapidapi.com/search" 
        querystring = {
            "query": current_query,
            "num_pages": "1",
            "date_posted": "all",
            "page": "1"
        }

        headers = {
            "X-RapidAPI-Key": JOB_API_KEY,
            "X-RapidAPI-Host": JOB_API_HOST
        }

        try:
            response = requests.get(url, headers=headers, params=querystring, timeout=15)
            print(f"\n🌍 Attempting query: {current_query}")
            response.raise_for_status()
            data = response.json()

            job_data_list = data.get("data", [])
            print(f"✅ Jobs Found: {len(job_data_list)} for query: {current_query}")

            if job_data_list:
                processed_jobs = []
                for job in job_data_list[:5]:
                    location = job.get("job_city", "")
                    state = job.get("job_state", "")
                    
                    # --- Robust Salary Fallback ---
                    salary_data = job.get("job_salary") 
                    if salary_data and str(salary_data).strip() not in ["None", "null", "N/A", ""]:
                        final_salary = salary_data
                    else:
                        final_salary = "Not Disclosed (Competitive)"
                        
                    # --- Robust Skills Fallback ---
                    qualifications = job.get("job_highlights", {}).get("Qualifications")
                    if isinstance(qualifications, list) and qualifications:
                         job_skills = qualifications
                    else:
                         job_skills = ["Review Job Description for Details"]


                    processed_jobs.append({
                        "id": job.get("job_id", "N/A"),
                        "title": job.get("job_title", "Job Title Unavailable"),
                        "company": job.get("employer_name", "Unknown Company"),
                        "location": f"{location}, {state}".strip(", "),
                        "skills": job_skills,
                        "salary": final_salary,
                        "apply_link": job.get("job_apply_link", "#")
                    })
                return processed_jobs

        except requests.exceptions.RequestException as e:
            print(f"❌ API ERROR: {e}")
            print(f"⚠️ Failed query: {current_query}")
            continue

    # ✅ Fallback demo jobs (if ALL API attempts fail)
    print("⚙️ Fallback used — No jobs returned from API or all failed.")
    return [
        {"id": 1, "title": "Python Developer (Demo)", "company": "Google", "location": "Remote", "skills": ["Python", "Flask", "SQL"], "salary": "₹8–15 LPA (Demo)", "apply_link": "https://careers.google.com"},
        {"id": 2, "title": "Data Analyst (Demo)", "company": "Amazon", "location": "Hyderabad", "skills": ["Excel", "SQL", "Power BI"], "salary": "Not Disclosed (Demo)", "apply_link": "https://www.amazon.jobs"},
        {"id": 3, "title": "Frontend Intern (Demo)", "company": "Microsoft", "location": "Bangalore", "skills": ["HTML", "CSS", "JS"], "salary": "Competitive (Demo)", "apply_link": "https://careers.microsoft.com"}
    ]


def read_file_content(file, ext):
    """Reads text content from PDF or DOCX file."""
    content = ""
    try:
        if ext == 'docx':
            doc = Document(file)
            content = "\n".join([paragraph.text for paragraph in doc.paragraphs])
        elif ext == 'pdf':
            output_string = io.StringIO()
            file.seek(0)
            extract_text_to_fp(file, output_string, laparams=LAParams(), output_type='text', codec='utf-8')
            content = output_string.getvalue()
    except Exception as e:
        print(f"Error reading file content: {e}")
        content = ""
        
    return content.strip()

# --- Gemini Analysis Function ---
def analyze_resume_with_gemini(resume_text):
    """Sends resume content to Gemini for scoring and feedback."""
    if not resume_text:
        # Fallback data for empty content
        return {"score": 60, "strengths": ["No text content"], "weaknesses": ["Cannot analyze"], "skills": []}

    prompt = f"""
    Analyze the following resume text and provide the output strictly in a single JSON object. 
    The JSON object MUST contain the keys: score, strengths, weaknesses, and skills.
    
    Resume Text (Limit to 4000 characters for safety):
    ---
    {resume_text[:4000]} 
    ---
    
    Instructions for JSON:
    1. **score**: Assign a score between 60 and 95.
    2. **strengths**: List 3 key professional strengths found.
    3. **weaknesses**: List 3 areas for improvement.
    4. **skills**: List 5 most prominent technical skills found (e.g., Python, SQL, AWS).
    """

    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt
        )
        
        json_string = response.text.strip()
        if json_string.startswith("```json"):
            json_string = json_string.strip("```json").strip("```").strip()
        
        return json.loads(json_string)

    except Exception as e:
        print(f"Gemini API Error: {e}")
        # Return fallback data on AI failure
        return {
            "score": random.randint(65, 75),
            "strengths": ["Internet/API Connection failed."],
            "weaknesses": ["Cannot perform AI analysis."],
            "skills": ["Default", "Python", "SQL"]
        }
# -----------------------------------


# ---------------- DB setup / Signup / Login Routes ----------------
def init_db():
    conn = sqlite3.connect("users.db")
    cursor = conn.cursor()
    
    # 1. Users Table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
    """)
    
    # 2. Saved Jobs Table (NEW)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS saved_jobs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            job_id TEXT NOT NULL,
            job_title TEXT NOT NULL,
            job_company TEXT,
            job_location TEXT,
            job_salary TEXT,
            job_apply_link TEXT,
            UNIQUE(user_id, job_id),
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    """)
    
    conn.commit()
    conn.close()

init_db() 

@app.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    if not name or not email or not password:
        return jsonify({"success": False, "message": "All fields are required"}), 400
    hashed_password = generate_password_hash(password)
    try:
        conn = sqlite3.connect("users.db")
        cursor = conn.cursor()
        cursor.execute("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", (name, email, hashed_password))
        conn.commit()
        conn.close()
        return jsonify({"success": True, "message": "Signup successful"})
    except sqlite3.IntegrityError:
        return jsonify({"success": False, "message": "Email already exists"}), 400
    except Exception as e:
        return jsonify({"success": False, "message": f"Database error: {str(e)}"}), 500

@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    if not email or not password:
        return jsonify({"success": False, "message": "Email and password are required"}), 400
    try:
        conn = sqlite3.connect("users.db")
        cursor = conn.cursor()
        cursor.execute("SELECT id, name, email, password FROM users WHERE email=?", (email,))
        user = cursor.fetchone()
        conn.close()
        if user and check_password_hash(user[3], password):
            return jsonify({"success": True, "user": {"id": user[0], "name": user[1], "email": user[2]}})
        else:
            return jsonify({"success": False, "message": "Invalid email or password"}), 401
    except Exception as e:
        return jsonify({"success": False, "message": f"Server error during login: {str(e)}"}), 500

# ---------------- Saved Jobs Routes ----------------
@app.route("/save_job", methods=["POST"])
def save_job():
    data = request.get_json()
    user_id = data.get("user_id")
    job_details = data.get("job")
    
    if not user_id or not job_details:
        return jsonify({"success": False, "message": "User ID and job details are required"}), 400

    conn = sqlite3.connect("users.db")
    cursor = conn.cursor()
    
    # 1. Check if job is already saved
    cursor.execute(
        "SELECT id FROM saved_jobs WHERE user_id = ? AND job_id = ?", 
        (user_id, job_details.get("id"))
    )
    is_saved = cursor.fetchone()

    try:
        if is_saved:
            # Job is already saved, so UNSAVE (delete) it
            cursor.execute(
                "DELETE FROM saved_jobs WHERE id = ?", 
                (is_saved[0],)
            )
            conn.commit()
            return jsonify({"success": True, "message": "Job removed from saved list", "action": "removed"})
        else:
            # Job is not saved, so SAVE (insert) it
            cursor.execute(
                """
                INSERT INTO saved_jobs (user_id, job_id, job_title, job_company, job_location, job_salary, job_apply_link)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                """, 
                (
                    user_id, 
                    job_details.get("id"), 
                    job_details.get("title", "N/A"),
                    job_details.get("company", "N/A"),
                    job_details.get("location", "N/A"),
                    job_details.get("salary", "Not Disclosed"),
                    job_details.get("apply_link", "#")
                )
            )
            conn.commit()
            return jsonify({"success": True, "message": "Job saved successfully", "action": "saved"})
    
    except Exception as e:
        print(f"Error saving/unsaving job: {e}")
        return jsonify({"success": False, "message": f"Server error: {str(e)}"}), 500
    finally:
        conn.close()

@app.route("/get_saved_jobs", methods=["GET"])
def get_saved_jobs():
    user_id = request.args.get("user_id")
    
    if not user_id:
        return jsonify({"success": False, "message": "User ID is required"}), 400

    conn = sqlite3.connect("users.db")
    cursor = conn.cursor()
    
    try:
        cursor.execute(
            "SELECT job_id, job_title, job_company, job_location, job_salary, job_apply_link FROM saved_jobs WHERE user_id = ?", 
            (user_id,)
        )
        saved_jobs_raw = cursor.fetchall()
        
        saved_jobs_list = []
        for job in saved_jobs_raw:
            # Skills field is set to a static reminder
            saved_jobs_list.append({
                "id": job[0],
                "title": job[1],
                "company": job[2],
                "location": job[3],
                "salary": job[4],
                "apply_link": job[5],
                "skills": ["Saved job details. Check apply link for full skills."] 
            })
            
        return jsonify({"success": True, "saved_jobs": saved_jobs_list})
        
    except Exception as e:
        print(f"Error fetching saved jobs: {e}")
        return jsonify({"success": False, "message": f"Server error: {str(e)}"}), 500
    finally:
        conn.close()
# ---------------- End of Saved Jobs Routes ----------------
        
# ---------------- Resume Analyze (FINAL) ----------------
@app.route("/analyze", methods=["POST"])
def analyze_resume():
    if "resume" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["resume"]
    filename_lower = file.filename.lower() if file.filename else ""
    
    # 1. Validation
    ALLOWED_EXTENSIONS = {'pdf', 'docx'}
    ext = filename_lower.rsplit('.', 1)[-1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        return jsonify({"error": "Invalid file format. Only PDF and DOCX are allowed."}), 400
    
    # 2. Read Content
    resume_text = read_file_content(file, ext)
    if len(resume_text) < 100:
        return jsonify({"error": "Resume content too short or could not be read. Please use an ATS-friendly format."}), 400

    # 3. AI Analysis (Get Score, Feedback, Skills)
    ai_result = analyze_resume_with_gemini(resume_text)
    extracted_skills = ai_result.get("skills", [])
    
    # 4. Job Matching (Get REAL Jobs based on Skills)
    real_matched_jobs = get_real_jobs_from_api(extracted_skills)
    
    # 5. Return Final Results
    result = {
        "score": ai_result.get("score", 0),
        "strengths": ai_result.get("strengths", []),
        "weaknesses": ai_result.get("weaknesses", []),
        "skills": extracted_skills, 
        "matched_jobs": real_matched_jobs
    }

    return jsonify(result)

# ---------------- TEST ROUTE ----------------
@app.route("/test-users", methods=["GET"])
def test_users():
    """Temporary route to read and display all users in JSON format for debugging."""
    try:
        conn = sqlite3.connect("users.db")
        cursor = conn.cursor()
        cursor.execute("SELECT id, name, email FROM users")
        users = cursor.fetchall()
        conn.close()

        user_list = [{"id": u[0], "name": u[1], "email": u[2]} for u in users]
        print(f"--- DATABASE: Found {len(user_list)} users. ---")
        return jsonify({"success": True, "users": user_list})
    except Exception as e:
        return jsonify({"success": False, "message": f"DB Read Error: {str(e)}"}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)