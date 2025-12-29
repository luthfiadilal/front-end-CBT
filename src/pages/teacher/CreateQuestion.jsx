import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { getExams, createQuestion, updateQuestion, getQuestionById, getQuestionPairGroups } from '../../services/questionService';
import kriteriaService from '../../services/kriteriaService';


const CreateQuestion = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Get ID from URL for edit mode
    const isEditMode = !!id;

    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(false);

    const [difficultyLevels, setDifficultyLevels] = useState([]);
    // Form State	
    const [examId, setExamId] = useState('');
    const [questionText, setQuestionText] = useState('');
    const [selectedDifficultyId, setSelectedDifficultyId] = useState(''); // Store ID here	
    const [maxPoint, setMaxPoint] = useState('5');
    const [pairGroup, setPairGroup] = useState(''); // New State for Pair Group
    const [pairGroups, setPairGroups] = useState([]); // New State for Pair Group Suggestions

    // Image State
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [existingImageUrl, setExistingImageUrl] = useState(null); // For edit mode

    const [options, setOptions] = useState([
        { option_text: '', is_correct: false },
        { option_text: '', is_correct: false },
    ]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
        }
    };

    const handleRemoveImage = () => {
        setImageFile(null);
        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
            setImagePreview(null);
        }
        setExistingImageUrl(null); // Also clear existing image on remove
    };

    // Fetch pair groups whenever examId changes
    useEffect(() => {
        if (examId) {
            fetchPairGroups(examId);
        } else {
            setPairGroups([]);
        }
    }, [examId]);

    const fetchExams = async () => {
        try {
            const data = await getExams();
            setExams(data);
            if (!isEditMode && data.length > 0) setExamId(data[0].id);
        } catch (error) {
            console.error('Failed to fetch exams', error);
        }
    };

    const fetchDifficulties = async () => {
        try {
            const response = await kriteriaService.getAllTingkatKesulitan();
            // Check if response has data property (standard API wrapper)
            const levels = response.data || response;

            if (levels && Array.isArray(levels)) {
                setDifficultyLevels(levels);
                if (!isEditMode && levels.length > 0) setSelectedDifficultyId(levels[0].id);
                return levels;
            } else {
                console.warn('Difficulty levels data is not an array:', response);
                setDifficultyLevels([]);
            }
            return [];
        } catch (error) {
            console.error('Failed to fetch difficulty levels', error);
            setDifficultyLevels([]);
            return [];
        }
    };

    // Revised init
    useEffect(() => {
        const initData = async () => {
            await fetchExams();
            const levels = await fetchDifficulties();

            if (isEditMode) {
                try {
                    setLoading(true);
                    const data = await getQuestionById(id);

                    setExamId(data.exam_id);
                    setQuestionText(data.question_text);
                    setMaxPoint(data.max_point);
                    setPairGroup(data.pair_group || '');

                    if (data.image_url) {
                        setExistingImageUrl(data.image_url);
                        setImagePreview(data.image_url);
                    }

                    if (data.question_options) {
                        setOptions(data.question_options.map(opt => ({
                            option_text: opt.option_text,
                            is_correct: opt.is_correct
                        })));
                    }

                    // Match difficulty
                    // Data has `difficulty_level` (integer score). Levels have `bobot` (string/int) and `id`.
                    // We need to find level where level.bobot == data.difficulty_level
                    if (levels.length > 0) {
                        const matched = levels.find(l => parseInt(l.bobot) === data.difficulty_level);
                        if (matched) {
                            setSelectedDifficultyId(matched.id);
                        }
                    }
                } catch (err) {
                    console.error('Failed to fetch question details', err);
                    alert('Gagal memuat detail soal.');
                    navigate('/teacher/questions');
                } finally {
                    setLoading(false);
                }
            }
        };
        initData();
    }, [id]); // Only runs on mount or ID change

    const fetchPairGroups = async (id) => {
        try {
            const groups = await getQuestionPairGroups(id);
            if (Array.isArray(groups)) {
                setPairGroups(groups);
            }
        } catch (error) {
            console.error('Failed to fetch pair groups', error);
        }
    };

    const handleAddOption = () => {
        setOptions([...options, { option_text: '', is_correct: false }]);
    };

    const handleRemoveOption = (index) => {
        if (options.length > 2) {
            setOptions(options.filter((_, i) => i !== index));
        }
    };

    const handleOptionChange = (index, field, value) => {
        const newOptions = [...options];
        if (field === 'is_correct') {
            newOptions.forEach((opt, i) => {
                opt.is_correct = i === index ? value : false;
            });
        } else {
            newOptions[index][field] = value;
        }
        setOptions(newOptions);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const hasCorrectUrl = options.some(opt => opt.is_correct);
            if (!hasCorrectUrl) {
                alert('Silakan pilih minimal satu jawaban yang benar');
                setLoading(false);
                return;
            }

            // Find selected difficulty object to get bobot	
            const selectedDiff = difficultyLevels.find(d => d.id == selectedDifficultyId);
            const bobot = selectedDiff ? parseInt(selectedDiff.bobot) : 1; // Default to 1 if not found	

            const formData = new FormData();
            formData.append('exam_id', examId);
            formData.append('question_text', questionText);
            formData.append('difficulty_level', bobot);
            formData.append('max_point', parseInt(maxPoint));
            formData.append('question_type', 'mcq');

            // Append pair_group if it exists
            if (pairGroup && pairGroup.trim() !== '') {
                formData.append('pair_group', pairGroup.trim());
            }

            // Append options as JSON string
            const cleanedOptions = options.filter(o => o.option_text.trim() !== '');
            formData.append('options', JSON.stringify(cleanedOptions));

            if (imageFile) {
                formData.append('image', imageFile);
            } else if (isEditMode && existingImageUrl === null) {
                // If in edit mode and image was removed (existingImageUrl is null),
                // explicitly tell backend to remove it.
                formData.append('remove_image', 'true');
            }


            if (isEditMode) {
                await updateQuestion(id, formData);
                alert('Soal berhasil diperbarui!');
            } else {
                await createQuestion(formData);
                alert('Soal berhasil dibuat!');
            }
            navigate('/teacher/questions');
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (

        <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white">{isEditMode ? 'Edit Soal' : 'Buat Soal'}</h1>
                    <p className="text-white mt-1">{isEditMode ? 'Perbarui detail soal' : 'Tambahkan soal baru ke latihan'}</p>
                </div>
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-white text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm font-medium"
                >
                    <Icon icon="solar:arrow-left-bold" className="w-5 h-5" />
                    <span>Kembali</span>
                </button>
            </div>

            <div className="w-full">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">

                        {/* Exam Selection */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Pilih Latihan</label>
                            <div className="relative">
                                <select
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition appearance-none"
                                    value={examId}
                                    onChange={(e) => setExamId(e.target.value)}
                                    required
                                >
                                    <option value="" disabled>Pilih latihan...</option>
                                    {exams.map(exam => (
                                        <option key={exam.id} value={exam.id}>{exam.title}</option>
                                    ))}
                                </select>
                                <Icon icon="solar:alt-arrow-down-bold" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            </div>
                        </div>

                        {/* Pair Group Selection */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Grup Pasangan (Opsional)</label>
                            <p className="text-xs text-gray-500">Kelompokkan soal yang memiliki konteks sama (misalnya Bacaan yang Sama)</p>
                            <div className="relative">
                                <input
                                    type="text"
                                    list="pair-groups-list"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                                    placeholder="Pilih grup yang ada atau ketik nama grup baru..."
                                    value={pairGroup}
                                    onChange={(e) => setPairGroup(e.target.value)}
                                />
                                <datalist id="pair-groups-list">
                                    {pairGroups.map((group, index) => (
                                        <option key={index} value={group} />
                                    ))}
                                </datalist>
                            </div>
                        </div>

                        {/* Question Text */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Teks Soal</label>
                            <textarea
                                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition min-h-[150px] resize-y"
                                placeholder="Masukkan soal Anda di sini..."
                                value={questionText}
                                onChange={(e) => setQuestionText(e.target.value)}
                                required
                            />
                        </div>

                        {/* Image Upload */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Gambar Soal (Opsional)</label>
                            <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative overflow-hidden">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                {imagePreview ? (
                                    <div className="relative w-full">
                                        <img src={imagePreview} alt="Preview" className="max-h-64 mx-auto rounded-lg object-contain" />
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleRemoveImage();
                                            }}
                                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors z-10"
                                        >
                                            <Icon icon="solar:trash-bin-trash-bold" className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="text-center pointer-events-none">
                                        <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <Icon icon="solar:gallery-add-bold" className="w-6 h-6" />
                                        </div>
                                        <p className="text-sm font-medium text-gray-900">Klik untuk unggah gambar</p>
                                        <p className="text-xs text-gray-500 mt-1">SVG, PNG, JPG atau GIF (maks. 5MB)</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Difficulty */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Tingkat Kesulitan</label>
                                <div className="relative">
                                    <select
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition appearance-none"
                                        value={selectedDifficultyId}
                                        onChange={(e) => setSelectedDifficultyId(e.target.value)}
                                    >
                                        {difficultyLevels.map((diff) => (
                                            <option key={diff.id} value={diff.id}>
                                                {diff.kriteria}
                                            </option>
                                        ))}
                                    </select>
                                    <Icon icon="solar:alt-arrow-down-bold" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                </div>
                            </div>

                            {/* Points */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Poin</label>
                                <input
                                    type="number"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                                    value={maxPoint}
                                    onChange={(e) => setMaxPoint(e.target.value)}
                                    min="1"
                                />
                            </div>
                        </div>

                        {/* Options Section */}
                        <div className="pt-6 border-t border-gray-100">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">Pilihan Jawaban</h3>
                                    <p className="text-sm text-gray-500">Pilih jawaban yang benar dengan mengklik tombol radio</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleAddOption}
                                    className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors font-medium text-sm"
                                >
                                    <Icon icon="solar:add-circle-bold" className="w-5 h-5" />
                                    Tambah Pilihan
                                </button>
                            </div>

                            <div className="space-y-3">
                                {options.map((option, index) => (
                                    <div key={index} className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-white hover:border-green-200 hover:shadow-sm transition-all group">
                                        <div className="relative flex items-center justify-center p-1">
                                            <input
                                                type="radio"
                                                name="correct_option"
                                                checked={option.is_correct}
                                                onChange={(e) => handleOptionChange(index, 'is_correct', e.target.checked)}
                                                className="w-5 h-5 text-green-600 border-gray-300 focus:ring-green-500 cursor-pointer"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                placeholder={`Pilihan ${index + 1}`}
                                                className="w-full bg-transparent border-none focus:ring-0 text-gray-900 placeholder-gray-400 font-medium"
                                                value={option.option_text}
                                                onChange={(e) => handleOptionChange(index, 'option_text', e.target.value)}
                                                required
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveOption(index)}
                                            className={`p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition ${options.length <= 2 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            disabled={options.length <= 2}
                                        >
                                            <Icon icon="solar:trash-bin-trash-bold" className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="pt-6 border-t border-gray-100 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
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
                                        <span>{isEditMode ? 'Memperbarui...' : 'Menyimpan...'}</span>
                                    </>
                                ) : (
                                    <span>{isEditMode ? 'Perbarui Soal' : 'Simpan Soal'}</span>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

    );
};

export default CreateQuestion;
