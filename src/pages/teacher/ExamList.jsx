import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import examService from '../../services/examService';

const ExamList = () => {
    const navigate = useNavigate();
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchExams();
    }, []);

    const fetchExams = async () => {
        try {
            const data = await examService.getAllExams();
            setExams(data);
        } catch (error) {
            console.error('Failed to fetch exams', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this exam? This action cannot be undone.')) {
            try {
                await examService.deleteExam(id);
                fetchExams(); // Refresh list
            } catch (error) {
                alert('Failed to delete exam: ' + error.message);
            }
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Manage Exams</h1>
                    <p className="text-gray-500 mt-1">Create, update, and remove exams</p>
                </div>
                <button
                    onClick={() => navigate('/teacher/exams/create')}
                    className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors shadow-lg shadow-green-200 font-medium"
                >
                    <Icon icon="solar:add-circle-bold" className="w-5 h-5" />
                    <span>Create New Exam</span>
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Title</th>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">Questions</th>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">Duration</th>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">Status</th>
                                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                        <div className="flex justify-center items-center gap-2">
                                            <Icon icon="svg-spinners:ring-resize" className="w-5 h-5" />
                                            <span>Loading exams...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : exams.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                        No exams found. Click "Create New Exam" to get started.
                                    </td>
                                </tr>
                            ) : (
                                exams.map((exam) => (
                                    <tr key={exam.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-gray-900">{exam.title}</div>
                                            <div className="text-sm text-gray-500 truncate max-w-xs">{exam.description}</div>
                                        </td>
                                        <td className="px-6 py-4 text-center text-gray-600">
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-medium">
                                                {exam.total_questions} Qs
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center text-gray-600">
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-orange-50 text-orange-700 text-xs font-medium">
                                                {exam.total_time_minutes} m
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${exam.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                                {exam.is_active ? 'Active' : 'Draft'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => navigate(`/admin/exams/edit/${exam.id}`)}
                                                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Icon icon="solar:pen-bold" className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(exam.id)}
                                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <Icon icon="solar:trash-bin-trash-bold" className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ExamList;
