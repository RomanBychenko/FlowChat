const API_KEY = 'student-secret-key';

export async function apiRequest(url) {

    const response = await fetch(url, {
        headers: {
            'x-api-key': API_KEY
        }
    });

    return response.json();
}