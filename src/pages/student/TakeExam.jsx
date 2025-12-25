import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import examService from '../../services/examService';
import examStudentService from '../../services/examStudentService';

const TakeExam = () => {
    const { examId } = useParams();
    const navigate = useNavigate();

    const [exam, setExam] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [attemptId, setAttemptId] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const timerRef = useRef(null);

    useEffect(() => {
        initializeExam();
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, []);

    const initializeExam = async () => {
        try {
            // Get exam details
            const examData = await examService.getExamById(examId);
            setExam(examData);

            // Start exam attempt
            const startResponse = await examStudentService.startExam(examId);
            setAttemptId(startResponse.attempt_id);

            // Get questions
            const questionsData = await examStudentService.getExamQuestions(examId);
            setQuestions(questionsData.questions || questionsData); // Handle both {questions: []} and direct array

            // Initialize timer (convert minutes to seconds)
            setTimeRemaining(examData.total_time_minutes * 60);

            setLoading(false);
        } catch (error) {
            console.error('Failed to initialize exam:', error);
            alert('Gagal memulai ujian. Silakan coba lagi.');
            navigate('/student/latihan');
        }
    };

    // Timer countdown
    useEffect(() => {
        if (timeRemaining > 0 && !loading) {
            timerRef.current = setInterval(() => {
                setTimeRemaining(prev => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current);
                        handleTimeUp();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [timeRemaining, loading]);

    const handleTimeUp = () => {
        alert('Waktu habis! Ujian akan diselesaikan.');
        // Auto finish exam (optional - for now just navigate back)
        navigate('/student/latihan');
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleSelectAnswer = async (optionId) => {
        if (submitting) return;

        const currentQuestion = questions[currentQuestionIndex];

        // Update local state
        setSelectedAnswers(prev => ({
            ...prev,
            [currentQuestion.id]: optionId
        }));

        // Submit answer to backend
        setSubmitting(true);
        try {
            await examStudentService.submitAnswer(
                attemptId,
                currentQuestion.id,
                optionId
            );
        } catch (error) {
            console.error('Failed to submit answer:', error);
            alert('Gagal menyimpan jawaban. Silakan coba lagi.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    const handleFinishExam = () => {
        if (window.confirm('Apakah kamu yakin ingin menyelesaikan ujian?')) {
            // Navigate back to exam list
            // In future: call finishExam API
            navigate('/student/latihan');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-green-50 to-emerald-100">
                <div className="flex flex-col items-center gap-3">
                    <Icon icon="svg-spinners:ring-resize" className="w-12 h-12 text-green-600" />
                    <span className="text-gray-600 font-medium">Memuat ujian...</span>
                </div>
            </div>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];
    const answeredCount = Object.keys(selectedAnswers).length;
    const isLastQuestion = currentQuestionIndex === questions.length - 1;

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-100 via-green-50 to-emerald-100 p-4 md:p-6">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold text-gray-900 mb-1">{exam.title}</h1>
                            <p className="text-gray-600 text-sm">{exam.description}</p>
                        </div>

                        {/* Timer */}
                        <div className={`flex items-center gap-3 px-6 py-3 rounded-xl font-mono text-lg font-bold ${timeRemaining < 300
                            ? 'bg-red-100 text-red-700'
                            : 'bg-green-100 text-green-700'
                            }`}>
                            <Icon icon="solar:clock-circle-bold" className="w-6 h-6" />
                            <span>{formatTime(timeRemaining)}</span>
                        </div>
                    </div>

                    {/* Progress */}
                    <div className="mt-4 flex items-center gap-4">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${(answeredCount / questions.length) * 100}%` }}
                            />
                        </div>
                        <span className="text-sm font-medium text-gray-600">
                            {answeredCount}/{questions.length} Terjawab
                        </span>
                    </div>
                </div>

                {/* Question Card */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8 mb-6">
                    {/* Question Number */}
                    <div className="flex items-center gap-3 mb-6">
                        <span className="bg-green-100 text-green-700 font-bold px-4 py-2 rounded-lg">
                            Soal {currentQuestionIndex + 1} dari {questions.length}
                        </span>
                        {selectedAnswers[currentQuestion.id] && (
                            <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                                <Icon icon="solar:check-circle-bold" className="w-4 h-4" />
                                Sudah dijawab
                            </span>
                        )}
                    </div>

                    {/* Question Text */}
                    <div className="mb-8">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            {currentQuestion.question_text}
                        </h2>

                        {/* Question Image */}
                        {currentQuestion.image_url && (
                            <img
                                src={currentQuestion.image_url}
                                alt="Question"
                                className="max-w-md rounded-xl border border-gray-200 mb-4"
                            />
                        )}
                    </div>

                    {/* Options */}
                    <div className="space-y-3">
                        {currentQuestion.question_options?.map((option, index) => {
                            const isSelected = selectedAnswers[currentQuestion.id] === option.id;
                            const optionLabel = String.fromCharCode(65 + index); // A, B, C, D

                            return (
                                <button
                                    key={option.id}
                                    onClick={() => handleSelectAnswer(option.id)}
                                    disabled={submitting}
                                    className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${isSelected
                                        ? 'border-green-500 bg-green-50'
                                        : 'border-gray-200 hover:border-green-300 hover:bg-green-50/50'
                                        } ${submitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-bold ${isSelected
                                            ? 'bg-green-500 text-white'
                                            : 'bg-gray-100 text-gray-600'
                                            }`}>
                                            {optionLabel}
                                        </div>
                                        <span className="flex-1 text-gray-800 pt-1">
                                            {option.option_text}
                                        </span>
                                        {isSelected && (
                                            <Icon icon="solar:check-circle-bold" className="w-6 h-6 text-green-500 flex-shrink-0" />
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Navigation */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        {/* Previous Button */}
                        <button
                            onClick={handlePreviousQuestion}
                            disabled={currentQuestionIndex === 0}
                            className="w-full md:w-auto px-6 py-3 rounded-xl font-medium border-2 border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                        >
                            <Icon icon="solar:alt-arrow-left-bold" className="w-5 h-5" />
                            <span>Sebelumnya</span>
                        </button>

                        {/* Question Navigation Dots */}
                        <div className="flex flex-wrap gap-2 justify-center">
                            {questions.map((q, idx) => (
                                <button
                                    key={q.id}
                                    onClick={() => setCurrentQuestionIndex(idx)}
                                    className={`w-10 h-10 rounded-lg font-semibold transition-all ${idx === currentQuestionIndex
                                        ? 'bg-green-600 text-white scale-110'
                                        : selectedAnswers[q.id]
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                    title={`Soal ${idx + 1}`}
                                >
                                    {idx + 1}
                                </button>
                            ))}
                        </div>

                        {/* Next/Finish Button */}
                        {isLastQuestion ? (
                            <button
                                onClick={handleFinishExam}
                                className="w-full md:w-auto px-6 py-3 rounded-xl font-medium bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-200"
                            >
                                <Icon icon="solar:check-circle-bold" className="w-5 h-5" />
                                <span>Selesai</span>
                            </button>
                        ) : (
                            <button
                                onClick={handleNextQuestion}
                                className="w-full md:w-auto px-6 py-3 rounded-xl font-medium bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-200"
                            >
                                <span>Selanjutnya</span>
                                <Icon icon="solar:alt-arrow-right-bold" className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TakeExam;
