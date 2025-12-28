import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import examService from '../../services/examService';
import examStudentService from '../../services/examStudentService';

const TeacherRanking = () => {
    const navigate = useNavigate();
    const [exams, setExams] = useState([]);
    const [selectedExam, setSelectedExam] = useState(null);
    const [rankings, setRankings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingRanking, setLoadingRanking] = useState(false);

    useEffect(() => {
        fetchExams();
    }, []);

    const fetchExams = async () => {
        try {
            const data = await examService.getAllExams();
            const activeExams = data.filter(exam => exam.is_active);
            setExams(activeExams);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch exams', error);
            setLoading(false);
        }
    };

    const handleSelectExam = async (exam) => {
        setSelectedExam(exam);
        setLoadingRanking(true);
        try {
            const data = await examStudentService.getExamRanking(exam.id);
            setRankings(data.rankings || []);
        } catch (error) {
            console.error('Failed to fetch rankings', error);
            setRankings([]);
        } finally {
            setLoadingRanking(false);
        }
    };

    const handleViewResult = (attemptId) => {
        // Teachers can view all student results without restriction
        navigate(`/student/latihan/result/${attemptId}`);
    };

    const getMedalIcon = (rank) => {
        if (rank === 1) return { icon: 'solar:medal-star-bold', color: 'text-yellow-500' };
        if (rank === 2) return { icon: 'solar:medal-ribbons-star-bold', color: 'text-gray-400' };
        if (rank === 3) return { icon: 'solar:medal-ribbons-bold', color: 'text-orange-600' };
        return null;
    };

    const getStatusBadge = (status) => {
        const colors = {
            'Mutqin': 'bg-blue-100 text-blue-700 border-blue-200',
            'Fasih': 'bg-green-100 text-green-700 border-green-200',
            'Mujtahid': 'bg-orange-100 text-orange-700 border-orange-200'
        };
        return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="flex flex-col items-center gap-3">
                    <Icon icon="svg-spinners:ring-resize" className="w-12 h-12 text-orange-300" />
                    <span className="text-white">Memuat data...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Ranking Ujian Siswa</h1>
                <p className="text-white">Lihat peringkat hasil ujian siswa</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Exam List Sidebar */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Icon icon="solar:clipboard-list-bold" className="w-5 h-5 text-green-600" />
                            Pilih Ujian
                        </h2>

                        {exams.length === 0 ? (
                            <p className="text-gray-500 text-sm">Belum ada ujian aktif.</p>
                        ) : (
                            <div className="space-y-2">
                                {exams.map((exam) => (
                                    <button
                                        key={exam.id}
                                        onClick={() => handleSelectExam(exam)}
                                        className={`w-full text-left p-4 rounded-xl transition-all duration-200 ${selectedExam?.id === exam.id
                                            ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg'
                                            : 'bg-gray-50 hover:bg-gray-100 text-gray-900'
                                            }`}
                                    >
                                        <div className="font-semibold text-sm line-clamp-2 mb-1">
                                            {exam.title}
                                        </div>
                                        <div className={`text-xs ${selectedExam?.id === exam.id ? 'text-white/80' : 'text-gray-500'}`}>
                                            {exam.total_questions} soal • {exam.total_time_minutes} menit
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Ranking Table */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        {!selectedExam ? (
                            <div className="p-12 text-center">
                                <Icon icon="solar:ranking-bold" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Pilih Ujian</h3>
                                <p className="text-gray-500">Pilih ujian untuk melihat ranking siswa</p>
                            </div>
                        ) : loadingRanking ? (
                            <div className="p-12 text-center">
                                <Icon icon="svg-spinners:ring-resize" className="w-12 h-12 text-green-600 mx-auto mb-4" />
                                <p className="text-gray-600">Memuat ranking...</p>
                            </div>
                        ) : (
                            <>
                                {/* Table Header */}
                                <div className="bg-gradient-to-r from-orange-400 to-orange-500 p-6" style={{ background: 'linear-gradient(to right, #f7941e, #e67e22)' }}>
                                    <h2 className="text-xl font-bold text-white mb-1">{selectedExam.title}</h2>
                                    <p className="text-white/80 text-sm">
                                        {rankings.length} peserta
                                    </p>
                                </div>

                                {/* Table Content */}
                                <div className="overflow-x-auto">
                                    {rankings.length === 0 ? (
                                        <div className="p-12 text-center">
                                            <Icon icon="solar:user-bold" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Belum Ada Data</h3>
                                            <p className="text-gray-500">Belum ada siswa yang menyelesaikan ujian ini</p>
                                        </div>
                                    ) : (
                                        <table className="w-full">
                                            <thead className="bg-gray-50 border-b border-gray-200">
                                                <tr>
                                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                        Rank
                                                    </th>
                                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                        Nama
                                                    </th>
                                                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                        Nilai
                                                    </th>
                                                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                        Status
                                                    </th>
                                                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                        Aksi
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {rankings.map((rank, index) => {
                                                    const medal = getMedalIcon(rank.ranking);
                                                    return (
                                                        <tr
                                                            key={rank.user_uid}
                                                            className="hover:bg-gray-50 transition-colors duration-150"
                                                        >
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="flex items-center gap-2">
                                                                    {medal ? (
                                                                        <Icon icon={medal.icon} className={`w-6 h-6 ${medal.color}`} />
                                                                    ) : (
                                                                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                                                                            <span className="text-sm font-bold text-gray-700">
                                                                                {rank.ranking}
                                                                            </span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <div>
                                                                    <div className="font-semibold text-gray-900">
                                                                        {rank.user_name}
                                                                    </div>
                                                                    {rank.user_details?.kelas && (
                                                                        <div className="text-xs text-gray-500">
                                                                            Kelas {rank.user_details.kelas}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 text-center">
                                                                <div className="font-bold text-2xl text-green-600">
                                                                    {rank.nilai_konversi.toFixed(1)}
                                                                </div>
                                                                <div className="text-xs text-gray-500">
                                                                    SAW: {rank.nilai_preferensi.toFixed(3)}
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 text-center">
                                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(rank.status)}`}>
                                                                    {rank.status}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 text-center">
                                                                <button
                                                                    onClick={() => handleViewResult(rank.attempt_id)}
                                                                    className="inline-flex items-center gap-2 px-4 py-2 text-white text-sm font-medium rounded-lg transition-colors duration-200 hover:opacity-90"
                                                                    style={{ backgroundColor: '#f7941e' }}
                                                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e67e22'}
                                                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f7941e'}
                                                                >
                                                                    <Icon icon="solar:eye-bold" className="w-4 h-4" />
                                                                    <span>Detail</span>
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherRanking;
