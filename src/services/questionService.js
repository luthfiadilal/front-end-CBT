import api from './api';

export const getExams = async () => {
    const response = await api.get('/exams');
    return response.data;
};

export const getAllQuestions = async () => {
    const response = await api.get('/questions');
    return response.data;
};

export const getQuestionById = async (id) => {
    const response = await api.get(`/questions/${id}`);
    return response.data;
};

export const updateQuestion = async (id, questionData) => {
    const isFormData = questionData instanceof FormData;
    const response = await api.put(`/questions/${id}`, questionData, {
        headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
    });
    return response.data;
};

export const deleteQuestion = async (id) => {
    const response = await api.delete(`/questions/${id}`);
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

export const getQuestionPairGroups = async (examId) => {
    const response = await api.get(`/questions/pair-groups`, {
        params: { exam_id: examId }
    });
    return response.data;
};
