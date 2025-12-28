import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import examService from '../../services/examService';
import userService from '../../services/userService';

const StudentExamAttempts = () => {
    const navigate = useNavigate();
    const [exams, setExams] = useState([]);
    const [selectedExamId, setSelectedExamId] = useState('');
    const [students, setStudents] = useState([]);
    const [loadingExams, setLoadingExams] = useState(true);
    const [loadingStudents, setLoadingStudents] = useState(false);

    useEffect(() => {
        fetchExams();
    }, []);

    const fetchExams = async () => {
        try {
            const data = await examService.getAllExams();
            setExams(data);
        } catch (error) {
            console.error('Failed to fetch exams:', error);
        } finally {
            setLoadingExams(false);
        }
    };

    const handleExamChange = async (e) => {
        const examId = e.target.value;
        setSelectedExamId(examId);

        if (!examId) {
            setStudents([]);
            return;
        }

        setLoadingStudents(true);
        try {
            const response = await userService.getStudentsExamStatus(examId);
            setStudents(response.data || []);
        } catch (error) {
            console.error('Failed to fetch students status:', error);
            setStudents([]);
        } finally {
            setLoadingStudents(false);
        }
    };

    const handleViewResult = (attemptId) => {
        if (attemptId) {
            navigate(`/student/latihan/result/${attemptId}`);
        }
    };

    if (loadingExams) {
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
                <h1 className="text-3xl font-bold text-white mb-2">Latihan Siswa</h1>
                <p className="text-white">Lihat status pengerjaan latihan oleh siswa</p>
            </div>

            {/* Exam Selector */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pilih Latihan
                </label>
                <select
                    value={selectedExamId}
                    onChange={handleExamChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                >
                    <option value="">-- Pilih Latihan --</option>
                    {exams.map((exam) => (
                        <option key={exam.id} value={exam.id}>
                            {exam.title}
                        </option>
                    ))}
                </select>
            </div>

            {/* Students Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {!selectedExamId ? (
                    <div className="p-12 text-center">
                        <Icon icon="solar:clipboard-list-bold" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Pilih Latihan</h3>
                        <p className="text-gray-500">Pilih latihan untuk melihat status pengerjaan siswa</p>
                    </div>
                ) : loadingStudents ? (
                    <div className="p-12 text-center">
                        <Icon icon="svg-spinners:ring-resize" className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                        <p className="text-gray-600">Memuat data siswa...</p>
                    </div>
                ) : (
                    <>
                        {/* Table Header */}
                        <div className="bg-gradient-to-r from-orange-400 to-orange-500 p-6">
                            <h2 className="text-xl font-bold text-white mb-1">
                                {exams.find(e => e.id == selectedExamId)?.title}
                            </h2>
                            <p className="text-white/80 text-sm">
                                {students.length} siswa terdaftar
                            </p>
                        </div>

                        {/* Table Content */}
                        <div className="overflow-x-auto">
                            {students.length === 0 ? (
                                <div className="p-12 text-center">
                                    <Icon icon="solar:user-bold" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Tidak Ada Siswa</h3>
                                    <p className="text-gray-500">Belum ada siswa terdaftar di sistem</p>
                                </div>
                            ) : (
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                No
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Nama Siswa
                                            </th>
                                            <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                NIS
                                            </th>
                                            <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Kelas
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
                                        {students.map((student, index) => (
                                            <tr
                                                key={student.user_uid}
                                                className="hover:bg-gray-50 transition-colors duration-150"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {index + 1}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="font-semibold text-gray-900">
                                                        {student.nama}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {student.email}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className="text-sm font-medium text-gray-700">
                                                        {student.nis || '-'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
                                                        {student.kelas || '-'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${student.exam_status === 'Sudah Mengerjakan'
                                                            ? 'bg-green-100 text-green-700 border-green-200'
                                                            : 'bg-gray-100 text-gray-600 border-gray-200'
                                                        }`}>
                                                        {student.exam_status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    {student.exam_status === 'Sudah Mengerjakan' && student.attempt_id ? (
                                                        <button
                                                            onClick={() => handleViewResult(student.attempt_id)}
                                                            className="inline-flex items-center gap-2 px-4 py-2 text-white text-sm font-medium rounded-lg transition-colors duration-200 hover:opacity-90"
                                                            style={{ backgroundColor: '#f7941e' }}
                                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e67e22'}
                                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f7941e'}
                                                        >
                                                            <Icon icon="solar:eye-bold" className="w-4 h-4" />
                                                            <span>Lihat Hasil</span>
                                                        </button>
                                                    ) : (
                                                        <span className="text-gray-400 text-sm">-</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default StudentExamAttempts;
