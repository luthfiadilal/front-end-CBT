import { useEffect, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { Icon } from '@iconify/react';
import api from '../../services/api';
import authService from '../../services/authService';

const ExamResult = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { attemptId } = useParams(); // Get attemptId from URL if present
    const [resultData, setResultData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResultData = async () => {
            // Check if data is passed via navigation state
            if (location.state?.resultData) {
                setResultData(location.state.resultData);
                setLoading(false);
            }
            // Otherwise, fetch data by attemptId from URL 
            else if (attemptId) {
                try {
                    // Get current user info for authorization
                    const currentUser = authService.getCurrentUser();

                    const response = await api.get(`/exam/result/${attemptId}`, {
                        params: {
                            user_uid: currentUser.id,
                            user_role: currentUser.role
                        }
                    });
                    setResultData(response.data);
                    setLoading(false);
                } catch (error) {
                    console.error('Failed to fetch exam result:', error);

                    // Check if forbidden
                    if (error.response?.status === 403) {
                        alert('Anda tidak memiliki izin untuk melihat hasil ujian ini.');
                    } else {
                        alert('Gagal memuat hasil ujian.');
                    }
                    navigate('/student/latihan');
                }
            }
            // No data source available
            else {
                navigate('/student/latihan');
            }
        };

        fetchResultData();
    }, [location, attemptId, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-green-50 to-emerald-100">
                <div className="flex flex-col items-center gap-3">
                    <Icon icon="svg-spinners:ring-resize" className="w-12 h-12 text-green-600" />
                    <span className="text-gray-600">Memuat hasil...</span>
                </div>
            </div>
        );
    }

    const { saw_result, total_correct, total_questions, total_score, duration_minutes, raw_data, saw_values, answers } = resultData;

    const getStatusColor = (status) => {
        if (status === 'Mutqin') return 'from-blue-500 to-blue-600';
        if (status === 'Fasih') return 'from-green-500 to-green-600';
        return 'from-orange-500 to-orange-600';
    };

    const getStatusIcon = (status) => {
        if (status === 'Mutqin') return 'solar:medal-star-bold';
        if (status === 'Fasih') return 'solar:cup-star-bold';
        return 'solar:star-bold';
    };

    return (
        <div className="min-h-screen  p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-6">
                    <div className="text-center mb-6">
                        <div className="flex justify-center mb-4">
                            <div className={`bg-gradient-to-r ${getStatusColor(saw_result.status)} text-white rounded-full p-6`}>
                                <Icon icon={getStatusIcon(saw_result.status)} className="w-16 h-16" />
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Ujian Selesai!</h1>
                        <p className="text-gray-600">Berikut adalah hasil ujian Anda</p>
                    </div>

                    {/* Main Score Card */}
                    <div className={`bg-gradient-to-r ${getStatusColor(saw_result.status)} rounded-2xl p-6 text-white text-center`}>
                        <div className="text-6xl font-bold mb-2">{saw_result.nilai_konversi.toFixed(2)}</div>
                        <div className="text-xl font-semibold mb-1">Nilai Akhir</div>
                        <div className="text-lg opacity-90">Status: {saw_result.status}</div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <Icon icon="solar:check-circle-bold" className="w-6 h-6 text-green-600" />
                            <span className="text-gray-600 text-sm">Jawaban Benar</span>
                        </div>
                        <div className="text-3xl font-bold text-gray-900">
                            {total_correct}<span className="text-lg text-gray-500">/{total_questions}</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <Icon icon="solar:star-bold" className="w-6 h-6 text-orange-600" />
                            <span className="text-gray-600 text-sm">Total Skor</span>
                        </div>
                        <div className="text-3xl font-bold text-gray-900">{total_score}</div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <Icon icon="solar:clock-circle-bold" className="w-6 h-6 text-blue-600" />
                            <span className="text-gray-600 text-sm">Waktu</span>
                        </div>
                        <div className="text-3xl font-bold text-gray-900">{duration_minutes}<span className="text-lg text-gray-500">m</span></div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <Icon icon="solar:chart-2-bold" className="w-6 h-6 text-purple-600" />
                            <span className="text-gray-600 text-sm">SAW Score</span>
                        </div>
                        <div className="text-3xl font-bold text-gray-900">{saw_result.nilai_preferensi.toFixed(3)}</div>
                    </div>
                </div>

                {/* SAW Criteria */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Icon icon="solar:chart-square-bold" className="w-6 h-6 text-green-600" />
                        Analisis SAW (Simple Additive Weighting)
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        {/* Raw Data */}
                        <div className="bg-blue-50 rounded-xl p-4">
                            <h3 className="font-semibold text-gray-900 mb-3">Data Mentah</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Jumlah Benar:</span>
                                    <span className="font-semibold text-gray-900">{raw_data.jumlah_benar}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Skor Kesulitan:</span>
                                    <span className="font-semibold text-gray-900">{raw_data.skor_kesulitan}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Pasangan Benar:</span>
                                    <span className="font-semibold text-gray-900">{raw_data.pasangan_benar}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Waktu (menit):</span>
                                    <span className="font-semibold text-gray-900">{raw_data.waktu_menit}</span>
                                </div>
                            </div>
                        </div>

                        {/* SAW Values */}
                        <div className="bg-green-50 rounded-xl p-4">
                            <h3 className="font-semibold text-gray-900 mb-3">Nilai Kriteria (Crips 1-5)</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">C1 (Ketepatan):</span>
                                    <span className="font-semibold text-gray-900">{saw_values.c1}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">C2 (Kesulitan):</span>
                                    <span className="font-semibold text-gray-900">{saw_values.c2}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">C3 (Konsistensi):</span>
                                    <span className="font-semibold text-gray-900">{saw_values.c3}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">C4 (Waktu):</span>
                                    <span className="font-semibold text-gray-900">{saw_values.c4}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-4">
                        <h3 className="font-semibold text-gray-900 mb-2">Perhitungan Akhir</h3>
                        <div className="text-sm text-gray-700">
                            <p className="mb-1">Bobot: C1(40%) + C2(30%) + C3(20%) + C4(10%)</p>
                            <p className="font-medium">Nilai Preferensi: {saw_result.nilai_preferensi.toFixed(4)}</p>
                            <p className="font-medium">Nilai Konversi (0-100): {saw_result.nilai_konversi.toFixed(2)}</p>
                        </div>
                    </div>
                </div>

                {/* Detailed Answers */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Icon icon="solar:clipboard-list-bold" className="w-6 h-6 text-green-600" />
                        Detail Jawaban
                    </h2>

                    <div className="space-y-4">
                        {answers && answers.map((answer, index) => {
                            const question = answer.questions;
                            const correctOption = question.question_options?.find(opt => opt.is_correct);
                            const selectedOption = question.question_options?.find(opt => opt.id === answer.selected_option_id);

                            return (
                                <div
                                    key={answer.id}
                                    className={`border-2 rounded-xl p-4 ${answer.is_correct ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                                        }`}
                                >
                                    <div className="flex items-start gap-3 mb-3">
                                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white ${answer.is_correct ? 'bg-green-500' : 'bg-red-500'
                                            }`}>
                                            <Icon icon={answer.is_correct ? "solar:check-circle-bold" : "solar:close-circle-bold"} className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="font-semibold text-gray-900">Soal {index + 1}</span>
                                                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                                                    Level {question.difficulty_level}
                                                </span>
                                                <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded-full">
                                                    Poin: {answer.auto_score}/{question.max_point}
                                                </span>
                                                {question.pair_group && (
                                                    <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
                                                        {question.pair_group}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-gray-900 mb-3">{question.question_text}</p>

                                            <div className="space-y-2">
                                                <div>
                                                    <span className="text-sm font-medium text-gray-700">Jawaban Anda: </span>
                                                    <span className={`text-sm ${answer.is_correct ? 'text-green-700 font-medium' : 'text-red-700'}`}>
                                                        {selectedOption?.option_text || 'Tidak dijawab'}
                                                    </span>
                                                </div>
                                                {!answer.is_correct && correctOption && (
                                                    <div>
                                                        <span className="text-sm font-medium text-gray-700">Jawaban Benar: </span>
                                                        <span className="text-sm text-green-700 font-medium">
                                                            {correctOption.option_text}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Action Button */}
                <div className="flex justify-center">
                    <button
                        onClick={() => navigate('/student/latihan')}
                        className="bg-gradient-to-r from-orange-400 to-orange-500 text-white font-semibold py-4 px-8 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center gap-2 shadow-lg"
                    >
                        <Icon icon="solar:arrow-left-bold" className="w-5 h-5" />
                        <span>Kembali ke Daftar Latihan</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExamResult;
