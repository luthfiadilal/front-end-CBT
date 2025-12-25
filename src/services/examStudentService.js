import api from './api';
import authService from './authService';

const examStudentService = {
    // Start exam attempt
    startExam: async (examId) => {
        const user = authService.getCurrentUser();
        const user_uid = user?.id; // Property is 'id', not 'uid'

        console.log('Starting exam - User:', user);
        console.log('Starting exam - user_uid:', user_uid);
        console.log('Starting exam - examId:', examId);

        if (!user_uid) {
            throw new Error('User not authenticated. Please login again.');
        }

        const response = await api.post('/student/exam/start', {
            exam_id: parseInt(examId),
            user_uid: user_uid
        });
        return response.data;
    },

    // Get exam questions
    getExamQuestions: async (examId) => {
        const response = await api.get(`/student/exam/${examId}/questions`);
        return response.data;
    },

    // Submit answer
    submitAnswer: async (attemptId, questionId, selectedOptionId, answerText = null) => {
        const response = await api.post('/student/exam/answer', {
            attempt_id: attemptId,
            question_id: questionId,
            selected_option_id: selectedOptionId,
            answer_text: answerText
        });
        return response.data;
    },

    // Get exam ranking
    getExamRanking: async (examId) => {
        const response = await api.get(`/student/exam/${examId}/ranking`);
        return response.data;
    },

    // Check exam status (completed, in_progress, not_started)
    getExamStatus: async (examId) => {
        const user = authService.getCurrentUser();
        const user_uid = user?.id;

        const response = await api.get(`/student/exam/${examId}/status`, {
            params: { user_uid }
        });
        return response.data;
    },

    // Finish exam and calculate SAW
    finishExam: async (attemptId, userUid, examId) => {
        const response = await api.post('/student/exam/finish', {
            attempt_id: attemptId,
            user_uid: userUid,
            exam_id: examId
        });
        return response.data;
    }
};

export default examStudentService;
