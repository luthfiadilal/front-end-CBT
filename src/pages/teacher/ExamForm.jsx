import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Icon } from '@iconify/react';
import examService from '../../services/examService';

const ExamForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(isEditMode);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        total_time_minutes: 60,
        total_questions: 10,
        is_active: true
    });

    useEffect(() => {
        if (isEditMode) {
            fetchExamDetails();
        }
    }, [id]);

    const fetchExamDetails = async () => {
        try {
            const data = await examService.getExamById(id);
            setFormData({
                title: data.title,
                description: data.description || '',
                total_time_minutes: data.total_time_minutes,
                total_questions: data.total_questions,
                is_active: data.is_active
            });
        } catch (error) {
            console.error('Failed to fetch exam details', error);
            alert('Gagal memuat detail latihan.');
            navigate('/teacher/exams');
        } finally {
            setFetching(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                ...formData,
                total_time_minutes: parseInt(formData.total_time_minutes),
                total_questions: parseInt(formData.total_questions)
            };

            if (isEditMode) {
                await examService.updateExam(id, payload);
                alert('Latihan berhasil diperbarui!');
            } else {
                await examService.createExam(payload);
                alert('Latihan berhasil dibuat!');
            }
            navigate('/teacher/exams');
        } catch (error) {
            console.error('Error saving exam:', error);
            alert(error.response?.data?.error || 'Gagal menyimpan latihan.');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <Icon icon="svg-spinners:ring-resize" className="w-8 h-8 text-green-600" />
            </div>
        );
    }

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white">{isEditMode ? 'Edit Latihan' : 'Buat Latihan Baru'}</h1>
                    <p className="text-white mt-1">{isEditMode ? 'Perbarui detail latihan' : 'Atur latihan baru'}</p>
                </div>
                <button
                    onClick={() => navigate('/teacher/exams')}
                    className="flex items-center gap-2 px-5 py-2.5 bg-white text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm font-medium"
                >
                    <Icon icon="solar:arrow-left-bold" className="w-5 h-5" />
                    <span>Kembali</span>
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Judul Latihan</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                            placeholder="misalnya Ujian Akhir Semester Matematika"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Deskripsi</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition min-h-[100px] resize-y"
                            placeholder="Deskripsi opsional..."
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Total Soal</label>
                            <input
                                type="number"
                                name="total_questions"
                                value={formData.total_questions}
                                onChange={handleChange}
                                required
                                min="1"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Durasi (Menit)</label>
                            <input
                                type="number"
                                name="total_time_minutes"
                                value={formData.total_time_minutes}
                                onChange={handleChange}
                                required
                                min="1"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <input
                            type="checkbox"
                            name="is_active"
                            id="is_active"
                            checked={formData.is_active}
                            onChange={handleChange}
                            className="w-5 h-5 text-green-600 rounded border-gray-300 focus:ring-green-500"
                        />
                        <label htmlFor="is_active" className="text-sm font-medium text-gray-700 cursor-pointer select-none">
                            Aktif (Langsung terlihat oleh siswa)
                        </label>
                    </div>

                    <div className="pt-6 border-t border-gray-100 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => navigate('/teacher/exams')}
                            className="px-6 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 px-8 py-2.5 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <Icon icon="svg-spinners:ring-resize" className="w-5 h-5" />
                                    <span>Menyimpan...</span>
                                </>
                            ) : (
                                <span>{isEditMode ? 'Perbarui Latihan' : 'Buat Latihan'}</span>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ExamForm;
