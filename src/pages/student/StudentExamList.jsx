import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import examService from '../../services/examService';
import examStudentService from '../../services/examStudentService';

const StudentExamList = () => {
    const navigate = useNavigate();
    const [exams, setExams] = useState([]);
    const [examStatuses, setExamStatuses] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchExams();
    }, []);

    const fetchExams = async () => {
        try {
            const data = await examService.getAllExams();
            // Filter only active exams for students
            const activeExams = data.filter(exam => exam.is_active);
            setExams(activeExams);

            // Fetch status for each exam
            await fetchExamStatuses(activeExams);
        } catch (error) {
            console.error('Failed to fetch exams', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchExamStatuses = async (examList) => {
        const statuses = {};
        await Promise.all(
            examList.map(async (exam) => {
                try {
                    const statusData = await examStudentService.getExamStatus(exam.id);
                    statuses[exam.id] = statusData.status;
                } catch (error) {
                    console.error(`Failed to fetch status for exam ${exam.id}:`, error);
                    statuses[exam.id] = 'not_started';
                }
            })
        );
        setExamStatuses(statuses);
    };

    const handleStartExam = (examId) => {
        const status = examStatuses[examId];

        if (status === 'completed') {
            alert('Anda sudah menyelesaikan ujian ini.');
            return;
        }

        navigate(`/student/latihan/take/${examId}`);
    };

    return (
        <div className="min-h-screen bg-brand-green p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Latihan Soal</h1>
                    <p className="text-gray-200">Pilih latihan yang ingin kamu kerjakan</p>
                </div>

                {/* Exam Cards Grid */}
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="flex flex-col items-center gap-3">
                            <Icon icon="svg-spinners:ring-resize" className="w-10 h-10 text-green-600" />
                            <span className="text-gray-500">Memuat latihan...</span>
                        </div>
                    </div>
                ) : exams.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                        <Icon icon="solar:clipboard-list-bold" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Belum Ada Latihan</h3>
                        <p className="text-gray-500">Saat ini belum ada latihan yang tersedia.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {exams.map((exam) => {
                            const status = examStatuses[exam.id];
                            const isCompleted = status === 'completed';
                            const isInProgress = status === 'in_progress';

                            return (
                                <div
                                    key={exam.id}
                                    className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-green-200 transition-all duration-300 overflow-hidden group"
                                >
                                    {/* Card Header */}
                                    <div className="bg-gradient-to-r from-green-500 to-green-600 p-6">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                                                <Icon icon="solar:clipboard-list-bold" className="w-6 h-6 text-white" />
                                            </div>
                                            <span className={`backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full ${isCompleted ? 'bg-blue-500/80' :
                                                    isInProgress ? 'bg-orange-500/80' :
                                                        'bg-white/20'
                                                }`}>
                                                {isCompleted ? 'Selesai' : isInProgress ? 'Berlangsung' : 'Aktif'}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
                                            {exam.title}
                                        </h3>
                                    </div>

                                    {/* Card Body */}
                                    <div className="p-6">
                                        <p className="text-gray-600 text-sm mb-6 line-clamp-3 min-h-[60px]">
                                            {exam.description || 'Tidak ada deskripsi'}
                                        </p>

                                        {/* Stats */}
                                        <div className="grid grid-cols-2 gap-4 mb-6">
                                            <div className="bg-blue-50 rounded-xl p-3">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Icon icon="solar:question-circle-bold" className="w-4 h-4 text-blue-600" />
                                                    <span className="text-xs text-gray-600">Soal</span>
                                                </div>
                                                <p className="text-lg font-bold text-blue-700">{exam.total_questions}</p>
                                            </div>
                                            <div className="bg-orange-50 rounded-xl p-3">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Icon icon="solar:clock-circle-bold" className="w-4 h-4 text-orange-600" />
                                                    <span className="text-xs text-gray-600">Waktu</span>
                                                </div>
                                                <p className="text-lg font-bold text-orange-700">{exam.total_time_minutes} menit</p>
                                            </div>
                                        </div>

                                        {/* Start Button */}
                                        <button
                                            onClick={() => handleStartExam(exam.id)}
                                            disabled={isCompleted}
                                            className={`w-full font-semibold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg ${isCompleted
                                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                    : isInProgress
                                                        ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-orange-200 group-hover:shadow-xl group-hover:shadow-orange-300'
                                                        : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-green-200 group-hover:shadow-xl group-hover:shadow-green-300'
                                                }`}
                                        >
                                            <Icon icon={isCompleted ? "solar:check-circle-bold" : isInProgress ? "solar:restart-bold" : "solar:play-circle-bold"} className="w-5 h-5" />
                                            <span>{isCompleted ? 'Sudah Dikerjakan' : isInProgress ? 'Lanjutkan' : 'Mulai Latihan'}</span>
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentExamList;
