// fileName: src/utils/api.js (The file Results.jsx is trying to import)

const API_BASE_URL = 'http://localhost:5000'; 

/**
 * Saves or unsaves a job by calling the Flask backend.
 */
export async function saveOrUnsaveJob(userId, jobObject) {
    if (!userId || !jobObject) {
        // Frontend validation
        return { success: false, message: "User or job data missing." };
    }

    try {
        const response = await fetch(`${API_BASE_URL}/save_job`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: userId,
                job: jobObject
            })
        });

        if (!response.ok) {
            // Handle HTTP errors (404, 500, etc.)
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return response.json();

    } catch (error) {
        console.error("API Error during save/unsave:", error);
        return { success: false, message: "Could not connect to the backend server." };
    }
}

/**
 * Fetches all jobs saved by the user.
 */
export async function fetchSavedJobs(userId) {
    if (!userId) {
        return [];
    }

    try {
        const url = `${API_BASE_URL}/get_saved_jobs?user_id=${userId}`;
        const response = await fetch(url);
        const result = await response.json();

        if (result.success) {
            return result.saved_jobs;
        } else {
            console.error("Failed to fetch saved jobs:", result.message);
            return [];
        }

    } catch (error) {
        console.error("Error fetching saved jobs from API:", error);
        return [];
    }
}