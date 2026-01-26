import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import examService from '../../services/examService';
import examStudentService from '../../services/examStudentService';
import CustomAlert from '../../components/common/CustomAlert';

const TeacherRanking = () => {
    const navigate = useNavigate();
    const [exams, setExams] = useState([]);
    const [selectedExam, setSelectedExam] = useState(null);
    const [rankings, setRankings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingRanking, setLoadingRanking] = useState(false);
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedStudent, setSelectedStudent] = useState('');
    const [printing, setPrinting] = useState(false);
    const [alert, setAlert] = useState({ isOpen: false, type: 'success', message: '' });
    const [deleting, setDeleting] = useState(false);

    const uniqueClasses = [...new Set(rankings.map(r => r.user_details?.kelas).filter(Boolean))];

    // Filtered rankings for Display & Dropdown options
    const filteredRankings = rankings.filter(r => {
        const matchClass = selectedClass ? r.user_details?.kelas === selectedClass : true;
        const matchStudent = selectedStudent ? r.user_uid === selectedStudent : true; // Although student filter usually selects one
        return matchClass && matchStudent;
    });

    // Student options based on selected class
    const studentOptions = rankings
        .filter(r => selectedClass ? r.user_details?.kelas === selectedClass : true)
        .map(r => ({ uid: r.user_uid, name: r.user_name }));

    useEffect(() => {
        // Reset filters when exam changes
        setSelectedClass('');
        setSelectedStudent('');
    }, [selectedExam]);

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

    // Helper to show alert
    const showAlert = (type, message) => {
        setAlert({ isOpen: true, type, message });
    };

    const handleDeleteFiltered = async () => {
        if (!selectedExam) return;

        const confirmMsg = selectedClass || selectedStudent
            ? "Apakah Anda yakin ingin menghapus data ujian sesuai filter yang dipilih? Data tidak bisa dikembalikan."
            : "PERINGATAN: Anda tidak memilih filter kelas atau siswa. Ini akan menghapus SEMUA hasil ujian untuk ujian ini. Lanjutkan?";

        if (!window.confirm(confirmMsg)) return;

        setDeleting(true);
        try {
            await examStudentService.deleteResult({
                exam_id: selectedExam.id,
                kelas: selectedClass || undefined,
                user_uid: selectedStudent || undefined
            });
            showAlert('success', 'Data ujian berhasil dihapus.');
            handleSelectExam(selectedExam); // Refresh
        } catch (error) {
            console.error("Delete Error:", error);
            showAlert('error', 'Gagal menghapus data ujian.');
        } finally {
            setDeleting(false);
        }
    };

    const handleDeleteResult = async (user_uid) => {
        if (!window.confirm("Apakah Anda yakin ingin menghapus data ujian siswa ini secara permanen?")) return;

        try {
            await examStudentService.deleteResult({
                exam_id: selectedExam.id,
                user_uid: user_uid
            });
            showAlert('success', 'Data ujian siswa berhasil dihapus.');
            // Refresh list
            handleSelectExam(selectedExam);
        } catch (error) {
            console.error("Gagal menghapus data:", error);
            showAlert('error', 'Terjadi kesalahan saat menghapus data.');
        }
    };

    const handlePrintDocs = async () => {
        if (!selectedExam) return;
        setPrinting(true);

        try {
            // Fetch detailed data for printing WITH FILTERS
            const params = {
                exam_id: selectedExam.id,
                kelas: selectedClass || undefined,
                user_uid: selectedStudent || undefined
            };

            const response = await examStudentService.getAllDetail(params);
            let data = response.data || [];

            // ... (rest of sorting and printing logic) ...

            if (data.length === 0) {
                showAlert('warning', "Tidak ada data untuk dicetak.");
                setPrinting(false);
                return;
            }

            // SORTING & RANKING LOGIC (Highest Score First)
            data.sort((a, b) => b.ranking_saw.nilai_konversi - a.ranking_saw.nilai_konversi);

            // Re-assign ranking number based on sorted order
            data = data.map((item, index) => {
                // Determine rank (handle ties if needed, but simple index+1 is requested)
                // For strict ties logic: if score same as prev, rank same. But user said "sadan seterusnya" implies 1,2,3..
                // Let's stick to 1, 2, 3 sequential for list clarity, or check standard ranking if preferred.
                // User said "kasih rranking 1, dan seterusnya", implies sequential 1..N
                return {
                    ...item,
                    ranking_saw: {
                        ...item.ranking_saw,
                        ranking: index + 1
                    }
                };
            });

            const doc = new jsPDF('l', 'mm', 'a4'); // Landscape orientation

            if (data.length > 1) {
                // --- PRINT LIST (TABLE) ---
                doc.setFontSize(16);
                doc.text(`Laporan Ranking: ${selectedExam.title}`, 14, 15);
                doc.setFontSize(10);
                doc.text(`Total Peserta: ${data.length}`, 14, 22);
                doc.text(`Tanggal Cetak: ${new Date().toLocaleDateString('id-ID')}`, 14, 27);

                const tableColumn = [
                    "Rank", "Nama", "Kelas", "Total Soal",
                    "Jml Benar", "Skor Sulit",
                    "Pas. Benar", "Durasi",
                    "Nilai Akhir", "SAW", "Status",
                ];
                const tableRows = [];

                data.forEach(item => {
                    const row = [
                        item.ranking_saw.ranking,
                        item.student_name,
                        item.student_class,
                        // New Columns
                        item.exam?.total_questions || 0,
                        item.hasil_cbt?.jumlah_benar || 0,
                        item.hasil_cbt?.skor_kesulitan || 0,
                        item.hasil_cbt?.pasangan_benar || 0,
                        (item.exam_attempt?.duration_minutes || 0) + ' mnt',

                        // Existing
                        item.ranking_saw.nilai_konversi.toFixed(1),
                        item.ranking_saw.nilai_preferensi.toFixed(3),
                        item.ranking_saw.status,
                    ];
                    tableRows.push(row);
                });

                autoTable(doc, {
                    head: [tableColumn],
                    body: tableRows,
                    startY: 35,
                    theme: 'striped',
                    headStyles: { fillColor: [247, 148, 30] }, // Orange header
                    styles: { fontSize: 9, cellPadding: 2 } // Adjust font size for many columns
                });

                doc.save(`Laporan_Ranking_${selectedExam.title}.pdf`);

            } else {
                // --- PRINT DETAIL (TRANSKRIP) ---
                const item = data[0];
                const attemptDate = new Date(item.exam_attempt?.finished_at || new Date()).toLocaleString('id-ID', {
                    dateStyle: 'full', timeStyle: 'short'
                });

                // Title - Jika user_uid filter aktif, pastikan judul sesuai
                doc.setFontSize(18);
                doc.setTextColor(247, 148, 30); // Orange
                doc.text("TRANSKRIP HASIL UJIAN", 105, 20, null, null, "center");

                doc.setDrawColor(200, 200, 200);
                doc.line(20, 25, 190, 25);

                // Student Info
                doc.setTextColor(0, 0, 0);
                doc.setFontSize(12);
                doc.text("Informasi Siswa", 20, 35);
                doc.setFontSize(10);
                doc.text(`Nama Lengkap`, 20, 45); doc.text(`: ${item.student_name}`, 60, 45);
                doc.text(`Kelas`, 20, 52); doc.text(`: ${item.student_class}`, 60, 52);
                doc.text(`NIS`, 20, 59); doc.text(`: ${item.siswa?.nis || '-'}`, 60, 59);

                // Exam Info
                doc.setFontSize(12);
                doc.text("Informasi Ujian", 20, 70);
                doc.setFontSize(10);
                doc.text(`Judul Ujian`, 20, 80); doc.text(`: ${item.exam_title}`, 60, 80);
                doc.text(`Waktu Selesai`, 20, 87); doc.text(`: ${attemptDate}`, 60, 87);
                doc.text(`Durasi`, 20, 94); doc.text(`: ${item.exam_attempt.duration_minutes} Menit`, 60, 94);

                // Result Box
                doc.setFillColor(245, 245, 245);
                doc.roundedRect(20, 105, 170, 40, 3, 3, 'F');

                doc.setFontSize(11);
                doc.text("Hasil Penilaian Akhir (Metode SAW)", 30, 115);

                doc.setFontSize(16);
                doc.setTextColor(34, 197, 94); // Green
                doc.text(`Nilai: ${item.ranking_saw.nilai_konversi.toFixed(1)}`, 30, 125);

                doc.setFontSize(12);
                doc.setTextColor(0, 0, 0);
                doc.text(`Status: ${item.ranking_saw.status}`, 30, 135);

                doc.setFontSize(10);
                doc.text(`Nilai Preferensi: ${item.ranking_saw.nilai_preferensi.toFixed(4)}`, 110, 125);

                // Detailed SAW Components
                doc.text("Rincian Komponen Penilaian:", 20, 160);
                const sawRows = [
                    ["Komponen", "Nilai Mentah", "Nilai Bobot (Crips)", "Keterangan"],
                    ["Ketepatan Jawaban (C1)", item.hasil_cbt.jumlah_benar + " Benar", item.nilai_saw.c1, "Benefit"],
                    ["Tingkat Kesulitan (C2)", item.hasil_cbt.skor_kesulitan + " Poin", item.nilai_saw.c2, "Benefit"],
                    ["Konsistensi Jawaban (C3)", item.hasil_cbt.pasangan_benar + " Pasangan", item.nilai_saw.c3, "Benefit"],
                    ["Waktu Pengerjaan (C4)", item.hasil_cbt.waktu_menit + " Menit", item.nilai_saw.c4, "Cost"]
                ];

                autoTable(doc, {
                    head: [sawRows[0]],
                    body: sawRows.slice(1),
                    startY: 165,
                    theme: 'grid',
                    headStyles: { fillColor: [50, 50, 50] }
                });

                doc.save(`Transkrip_${item.student_name}_${selectedExam.title.substring(0, 10)}.pdf`);
            }

        } catch (error) {
            console.error("Print Error:", error);
            showAlert('error', "Gagal mencetak dokumen.");
        } finally {
            setPrinting(false);
        }
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
            {alert.isOpen && (
                <CustomAlert
                    type={alert.type}
                    message={alert.message}
                    onClose={() => setAlert(prev => ({ ...prev, isOpen: false }))}
                />
            )}

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
                                {/* Filtering Controls */}
                                <div className="p-4 bg-white border-b border-gray-100 flex flex-wrap gap-4 items-center justify-between">
                                    <div className="flex gap-4 flex-1">
                                        {/* Filter Kelas */}
                                        <div className="relative min-w-[150px]">
                                            <select
                                                value={selectedClass}
                                                onChange={(e) => setSelectedClass(e.target.value)}
                                                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none"
                                            >
                                                <option value="">Semua Kelas</option>
                                                {uniqueClasses.map(cls => (
                                                    <option key={cls} value={cls}>{cls}</option>
                                                ))}
                                            </select>
                                            <Icon icon="solar:users-group-rounded-bold" className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                                            <Icon icon="solar:alt-arrow-down-bold" className="absolute right-3 top-2.5 text-gray-400 w-4 h-4 pointer-events-none" />
                                        </div>

                                        {/* Filter Siswa */}
                                        <div className="relative min-w-[200px]">
                                            <select
                                                value={selectedStudent}
                                                onChange={(e) => setSelectedStudent(e.target.value)}
                                                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none"
                                            >
                                                <option value="">Semua Siswa</option>
                                                {studentOptions.map(std => (
                                                    <option key={std.uid} value={std.uid}>{std.name}</option>
                                                ))}
                                            </select>
                                            <Icon icon="solar:user-bold" className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                                            <Icon icon="solar:alt-arrow-down-bold" className="absolute right-3 top-2.5 text-gray-400 w-4 h-4 pointer-events-none" />
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-2">
                                        {(selectedClass || selectedStudent) && (
                                            <button
                                                onClick={() => { setSelectedClass(''); setSelectedStudent(''); }}
                                                className="text-sm text-red-500 hover:text-red-700 font-medium px-2"
                                            >
                                                Reset
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Table Header */}
                                <div className="bg-gradient-to-r from-orange-400 to-orange-500 p-6 flex justify-between items-center" style={{ background: 'linear-gradient(to right, #f7941e, #e67e22)' }}>
                                    <div>
                                        <h2 className="text-xl font-bold text-white mb-1">{selectedExam.title}</h2>
                                        <p className="text-white/80 text-sm">
                                            {filteredRankings.length} peserta {selectedClass ? `(${selectedClass})` : ''}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleDeleteFiltered}
                                            disabled={printing || deleting || rankings.length === 0}
                                            className="bg-red-500/20 hover:bg-red-500/30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50 border border-white/20"
                                            title="Hapus data sesuai filter (Semua jika tanpa filter)"
                                        >
                                            {deleting ? (
                                                <Icon icon="svg-spinners:ring-resize" className="w-4 h-4" />
                                            ) : (
                                                <Icon icon="solar:trash-bin-trash-bold" className="w-4 h-4" />
                                            )}
                                            Hapus Data
                                        </button>
                                        <button
                                            onClick={handlePrintDocs}
                                            disabled={printing || deleting || rankings.length === 0}
                                            className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
                                        >
                                            {printing ? (
                                                <Icon icon="svg-spinners:ring-resize" className="w-4 h-4" />
                                            ) : (
                                                <Icon icon="solar:printer-bold" className="w-4 h-4" />
                                            )}
                                            Print PDF
                                        </button>
                                    </div>
                                </div>

                                {/* Table Content */}
                                <div className="overflow-x-auto">
                                    {filteredRankings.length === 0 ? (
                                        <div className="p-12 text-center">
                                            <Icon icon="solar:user-bold" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Belum Ada Data</h3>
                                            <p className="text-gray-500">
                                                {rankings.length > 0
                                                    ? 'Tidak ada data yang cocok dengan filter'
                                                    : 'Belum ada siswa yang menyelesaikan ujian ini'}
                                            </p>
                                        </div>
                                    ) : (
                                        <table className="w-full">
                                            <thead className="bg-gray-50 border-b border-gray-200">
                                                <tr>
                                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                        Peringkat
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
                                                {filteredRankings.map((rank, index) => {
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
                                                                <div className="flex items-center justify-center gap-2">
                                                                    <button
                                                                        onClick={() => handleViewResult(rank.attempt_id)}
                                                                        className="p-2 text-white rounded-lg transition-colors duration-200 hover:opacity-90"
                                                                        style={{ backgroundColor: '#f7941e' }}
                                                                        title="Lihat Detail"
                                                                    >
                                                                        <Icon icon="solar:eye-bold" className="w-4 h-4" />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleDeleteResult(rank.user_uid)}
                                                                        className="p-2 text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-200"
                                                                        title="Hapus Data"
                                                                    >
                                                                        <Icon icon="solar:trash-bin-trash-bold" className="w-4 h-4" />
                                                                    </button>
                                                                </div>
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
