import api from './api';

export const getExams = async () => {
    const response = await api.get('/exams');
    return response.data;
};

export const getAllQuestions = async () => {
    const response = await api.get('/questions');
    return response.data;
};

export const createQuestion = async (questionData) => {
    // Check if questionData is FormData
    const isFormData = questionData instanceof FormData;

    const response = await api.post('/questions', questionData, {
        headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
    });
    return response.data;
};
