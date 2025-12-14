import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { getAllQuestions } from '../../services/questionService';

const QuestionList = () => {
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        try {
            const data = await getAllQuestions();
            setQuestions(data);
        } catch (error) {
            console.error('Failed to fetch questions', error);
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetail = (question) => {
        setSelectedQuestion(question);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedQuestion(null);
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">All Questions</h1>
                    <p className="text-gray-500 mt-1">Manage and view all questions</p>
                </div>
                <button
                    onClick={() => navigate('/admin/questions/create')}
                    className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors shadow-sm font-medium"
                >
                    <Icon icon="solar:add-circle-bold" className="w-5 h-5" />
                    <span>Create Question</span>
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-200">
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">No</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Question</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Exam</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Difficulty</th>
                                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                        Loading questions...
                                    </td>
                                </tr>
                            ) : questions.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                        No questions found.
                                    </td>
                                </tr>
                            ) : (
                                questions.map((item, index) => (
                                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 text-sm text-gray-500">{index + 1}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900 font-medium max-w-md truncate">
                                            {item.question_text}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {item.exams?.title || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {item.difficulty_level}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleViewDetail(item)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="View Detail"
                                            >
                                                <Icon icon="solar:eye-bold" className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Detail Modal */}
            {isModalOpen && selectedQuestion && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                            <h2 className="text-xl font-bold text-gray-900">Question Detail</h2>
                            <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500">
                                <Icon icon="solar:close-circle-bold" className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Meta Info */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-gray-50 rounded-xl">
                                    <p className="text-sm text-gray-500 mb-1">Exam Name</p>
                                    <p className="font-semibold text-gray-900">{selectedQuestion.exams?.title || '-'}</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-xl">
                                    <p className="text-sm text-gray-500 mb-1">Details</p>
                                    <div className="flex gap-4">
                                        <div>
                                            <span className="text-xs text-gray-400 block">Difficulty</span>
                                            <span className="font-medium">{selectedQuestion.difficulty_level}</span>
                                        </div>
                                        <div>
                                            <span className="text-xs text-gray-400 block">Points</span>
                                            <span className="font-medium">{selectedQuestion.max_point}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Question Content */}
                            <div>
                                <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">Question</h3>
                                <div className="p-5 border border-gray-200 rounded-xl bg-white">
                                    <p className="text-gray-800 text-lg leading-relaxed">{selectedQuestion.question_text}</p>

                                    {selectedQuestion.image_url && (
                                        <div className="mt-4">
                                            <img
                                                src={selectedQuestion.image_url}
                                                alt="Question"
                                                className="max-h-64 rounded-lg border border-gray-100 shadow-sm object-contain"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Options */}
                            <div>
                                <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">Answer Options</h3>
                                <div className="space-y-3">
                                    {selectedQuestion.question_options?.map((opt, idx) => (
                                        <div
                                            key={idx}
                                            className={`p-4 rounded-xl border flex items-start gap-3 transition-colors ${opt.is_correct
                                                    ? 'bg-green-50 border-green-200 text-green-800'
                                                    : 'bg-white border-gray-200 text-gray-600'
                                                }`}
                                        >
                                            <div className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${opt.is_correct ? 'bg-green-200 text-green-700' : 'bg-gray-100 text-gray-500'
                                                }`}>
                                                {String.fromCharCode(65 + idx)}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium">{opt.option_text}</p>
                                                {opt.is_correct && (
                                                    <span className="inline-flex items-center gap-1 mt-1 text-xs font-bold text-green-600">
                                                        <Icon icon="solar:check-circle-bold" className="w-3 h-3" />
                                                        Correct Answer
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuestionList;
