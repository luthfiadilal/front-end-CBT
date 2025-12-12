
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/cbt';

export const getExams = async () => {
    try {
        const response = await fetch(`${API_URL}/exams`);
        if (!response.ok) throw new Error('Failed to fetch exams');
        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const createQuestion = async (questionData) => {
    try {
        const response = await fetch(`${API_URL}/questions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(questionData),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create question');
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
};
