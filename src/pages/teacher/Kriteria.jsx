import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';
import kriteriaService from '../../services/kriteriaService';
import CustomAlert from '../../components/common/CustomAlert';

const Kriteria = () => {
    const [activeTab, setActiveTab] = useState('master');
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [modal, setModal] = useState({ isOpen: false, type: 'add', item: null });
    const [formData, setFormData] = useState({});

    // Alert state
    const [alert, setAlert] = useState({ show: false, type: 'success', message: '' });

    // Tab Configuration
    const tabs = [
        { id: 'master', label: 'Master Kriteria' },
        { id: 'waktu', label: 'Waktu Pengerjaan' },
        { id: 'kesulitan', label: 'Tingkat Kesulitan' },
        { id: 'konsistensi', label: 'Konsistensi Jawaban' },
        { id: 'ketepatan', label: 'Ketepatan Jawaban' }
    ];

    // Fetch Data
    const fetchData = async () => {
        setLoading(true);
        try {
            let result;
            switch (activeTab) {
                case 'master': result = await kriteriaService.getAllKriteria(); break;
                case 'waktu': result = await kriteriaService.getAllWaktuPengerjaan(); break;
                case 'kesulitan': result = await kriteriaService.getAllTingkatKesulitan(); break;
                case 'konsistensi': result = await kriteriaService.getAllKonsistensiJawaban(); break;
                case 'ketepatan': result = await kriteriaService.getAllKetepatanJawaban(); break;
                default: result = { data: [] };
            }
            setData(result.data || []);
        } catch (error) {
            console.error('Error fetching data:', error);
            setData([]); // Fallback
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        setFormData({}); // Reset form when tab changes
    }, [activeTab]);

    // Handle Form Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...formData };
            // Ensure numbers are numbers
            ['bobot', 'min_menit', 'max_menit', 'min_skor', 'max_skor', 'min_benar', 'max_benar', 'min_pasangan', 'max_pasangan'].forEach(key => {
                if (payload[key]) payload[key] = Number(payload[key]);
            });

            if (modal.type === 'add') {
                switch (activeTab) {
                    case 'master': await kriteriaService.createKriteria(payload); break;
                    case 'waktu': await kriteriaService.createWaktuPengerjaan(payload); break;
                    case 'kesulitan': await kriteriaService.createTingkatKesulitan(payload); break;
                    case 'konsistensi': await kriteriaService.createKonsistensiJawaban(payload); break;
                    case 'ketepatan': await kriteriaService.createKetepatanJawaban(payload); break;
                }

                // Show success alert for create
                setAlert({
                    show: true,
                    type: 'success',
                    message: `Data berhasil ditambahkan! 🎉`
                });
            } else {
                const id = modal.item.id || modal.item.kode_kriteria;
                switch (activeTab) {
                    case 'master': await kriteriaService.updateKriteria(id, payload); break;
                    case 'waktu': await kriteriaService.updateWaktuPengerjaan(id, payload); break;
                    case 'kesulitan': await kriteriaService.updateTingkatKesulitan(id, payload); break;
                    case 'konsistensi': await kriteriaService.updateKonsistensiJawaban(id, payload); break;
                    case 'ketepatan': await kriteriaService.updateKetepatanJawaban(id, payload); break;
                }

                // Show success alert for edit
                setAlert({
                    show: true,
                    type: 'success',
                    message: `Data berhasil diupdate! 🎉`
                });
            }

            fetchData();
            setModal({ isOpen: false, type: 'add', item: null });
        } catch (error) {
            console.error('Error submitting form:', error);

            // Show error alert
            setAlert({
                show: true,
                type: 'error',
                message: error.message || 'Gagal menyimpan data. Silakan periksa input Anda.'
            });
        }
    };

    // Handle Delete
    const handleDelete = async (item) => {
        if (!window.confirm('Apakah Anda yakin ingin menghapus item ini?')) return;
        try {
            const id = item.id || item.kode_kriteria;
            switch (activeTab) {
                case 'master': await kriteriaService.deleteKriteria(id); break;
                case 'waktu': await kriteriaService.deleteWaktuPengerjaan(id); break;
                case 'kesulitan': await kriteriaService.deleteTingkatKesulitan(id); break;
                case 'konsistensi': await kriteriaService.deleteKonsistensiJawaban(id); break;
                case 'ketepatan': await kriteriaService.deleteKetepatanJawaban(id); break;
            }

            // Show success alert for delete
            setAlert({
                show: true,
                type: 'success',
                message: `Data berhasil dihapus! ✅`
            });

            fetchData();
        } catch (error) {
            console.error('Error deleting:', error);

            // Show error alert
            setAlert({
                show: true,
                type: 'error',
                message: error.message || 'Gagal menghapus item. Silakan coba lagi!'
            });
        }
    };

    // Open Modal
    const openModal = (type, item = null) => {
        setModal({ isOpen: true, type, item });
        setFormData(item ? { ...item } : {});
    };

    // Input Change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Render Table Headers
    const renderTableHeaders = () => {
        switch (activeTab) {
            case 'master':
                return (
                    <>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Kode</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Nama Kriteria</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Atribut</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Bobot</th>
                    </>
                );
            case 'waktu':
                return (
                    <>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Crips</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Range (Menit)</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Bobot</th>
                    </>
                );
            case 'kesulitan':
                return (
                    <>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Crips</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Range (Skor)</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Bobot</th>
                    </>
                );
            case 'konsistensi':
                return (
                    <>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Crips</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Range (Pasangan)</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Bobot</th>
                    </>
                );
            case 'ketepatan':
                return (
                    <>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Crips</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Range (Benar)</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Bobot</th>
                    </>
                );
            default: return null;
        }
    };

    // Render Table Rows
    const renderTableRows = (item) => {
        const actionButtons = (
            <div className="flex gap-2">
                <button onClick={() => openModal('edit', item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Icon icon="solar:pen-bold" width="18" />
                </button>
                <button onClick={() => handleDelete(item)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Icon icon="solar:trash-bin-trash-bold" width="18" />
                </button>
            </div>
        );

        switch (activeTab) {
            case 'master':
                return (
                    <>
                        <td className="px-6 py-4 text-sm text-gray-800 font-medium">{item.kode_kriteria}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{item.nama_kriteria}</td>
                        <td className="px-6 py-4 text-sm">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${item.atribut === 'Benefit' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                                }`}>
                                {item.atribut}
                            </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{item.bobot}</td>
                        <td className="px-6 py-4 text-right">{actionButtons}</td>
                    </>
                );
            case 'waktu':
                return (
                    <>
                        <td className="px-6 py-4 text-sm text-gray-800">{item.crips}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{item.min_menit} - {item.max_menit} Menit</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{item.bobot}</td>
                        <td className="px-6 py-4 text-right">{actionButtons}</td>
                    </>
                );
            case 'kesulitan':
                return (
                    <>
                        <td className="px-6 py-4 text-sm text-gray-800">{item.crips}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{item.min_skor} - {item.max_skor}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{item.bobot}</td>
                        <td className="px-6 py-4 text-right">{actionButtons}</td>
                    </>
                );
            case 'konsistensi':
                return (
                    <>
                        <td className="px-6 py-4 text-sm text-gray-800">{item.crips}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{item.min_pasangan} - {item.max_pasangan}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{item.bobot}</td>
                        <td className="px-6 py-4 text-right">{actionButtons}</td>
                    </>
                );
            case 'ketepatan':
                return (
                    <>
                        <td className="px-6 py-4 text-sm text-gray-800">{item.crips}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{item.min_benar} - {item.max_benar}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{item.bobot}</td>
                        <td className="px-6 py-4 text-right">{actionButtons}</td>
                    </>
                );
            default: return null;
        }
    };

    // Render Modal Content
    const renderModalFields = () => {
        const commonInput = (name, label, type = 'text', required = true) => (
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                <input
                    type={type}
                    name={name}
                    value={formData[name] || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                    required={required}
                />
            </div>
        );

        if (activeTab === 'master') {
            return (
                <>
                    {commonInput('kode_kriteria', 'Kode Kriteria')}
                    {commonInput('nama_kriteria', 'Nama Kriteria')}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Atribut</label>
                        <select
                            name="atribut"
                            value={formData.atribut || ''}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                            required
                        >
                            <option value="">Pilih Atribut</option>
                            <option value="Benefit">Benefit</option>
                            <option value="Cost">Cost</option>
                        </select>
                    </div>
                    {commonInput('bobot', 'Bobot', 'number')}
                </>
            );
        }

        // Sub Kriteria Fields
        return (
            <>
                {commonInput('kriteria', 'Kode Kriteria (Parent)')}
                {commonInput('crips', 'Crips (Label)')}
                <div className="flex gap-4">
                    <div className="flex-1">
                        {commonInput(
                            activeTab === 'waktu' ? 'min_menit' : activeTab === 'kesulitan' ? 'min_skor' : activeTab === 'konsistensi' ? 'min_pasangan' : 'min_benar',
                            'Nilai Min', 'number'
                        )}
                    </div>
                    <div className="flex-1">
                        {commonInput(
                            activeTab === 'waktu' ? 'max_menit' : activeTab === 'kesulitan' ? 'max_skor' : activeTab === 'konsistensi' ? 'max_pasangan' : 'max_benar',
                            'Nilai Maks', 'number'
                        )}
                    </div>
                </div>
                {commonInput('bobot', 'Bobot', 'number')}
            </>
        );
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white">Manajemen Kriteria</h1>
                    <p className="text-white mt-1">Kelola master kriteria dan pengaturan sub-kriteria</p>
                </div>
                <button
                    onClick={() => openModal('add')}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-xl hover:bg-green-700 transition-colors shadow-sm font-medium"
                >
                    <Icon icon="solar:add-circle-bold" className="w-5 h-5" />
                    <span>Tambah Baru</span>
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2 custom-scrollbar">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-5 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${activeTab === tab.id
                            ? 'bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-md'
                            : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Table Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                {renderTableHeaders()}
                                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="10" className="px-6 py-8 text-center text-gray-500">
                                        Memuat data...
                                    </td>
                                </tr>
                            ) : data.length === 0 ? (
                                <tr>
                                    <td colSpan="10" className="px-6 py-8 text-center text-gray-500">
                                        Tidak ada data tersedia
                                    </td>
                                </tr>
                            ) : (
                                data.map((item, index) => (
                                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                                        {renderTableRows(item)}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {modal.isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
                            onClick={() => setModal({ ...modal, isOpen: false })}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
                        >
                            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg pointer-events-auto overflow-hidden">
                                <form onSubmit={handleSubmit}>
                                    <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                                        <h3 className="text-lg font-bold text-gray-900">
                                            {modal.type === 'add' ? 'Tambah Baru' : 'Edit'} Item
                                        </h3>
                                        <button
                                            type="button"
                                            onClick={() => setModal({ ...modal, isOpen: false })}
                                            className="text-gray-400 hover:text-gray-600"
                                        >
                                            <Icon icon="solar:close-circle-bold" className="w-6 h-6" />
                                        </button>
                                    </div>
                                    <div className="p-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
                                        {renderModalFields()}
                                    </div>
                                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setModal({ ...modal, isOpen: false })}
                                            className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                                        >
                                            Batal
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors shadow-sm"
                                        >
                                            Simpan Perubahan
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Custom Alert */}
            {alert.show && (
                <CustomAlert
                    type={alert.type}
                    message={alert.message}
                    onClose={() => setAlert({ show: false, type: 'success', message: '' })}
                    duration={3000}
                />
            )}
        </div>
    );
};

export default Kriteria;
