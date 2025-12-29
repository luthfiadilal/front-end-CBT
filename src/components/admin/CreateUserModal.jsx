import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import userService from '../../services/userService';

// Move initialFormState outside component to prevent recreation on every render
const initialFormState = {
    nama: '',
    email: '',
    password: '',
    kelas: '',
    tanggal_lahir: '',
    alamat: ''
};

const CreateUserModal = ({ isOpen, onClose, onSuccess, userToEdit = null }) => {
    const isEditMode = !!userToEdit;
    const [role, setRole] = useState('siswa');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        if (isOpen) {
            if (userToEdit) {
                setRole(userToEdit.role);
                setFormData({
                    nama: userToEdit.nama || '',
                    email: userToEdit.email || '',
                    password: '', // Password usually blank on edit
                    kelas: userToEdit.kelas || '',
                    tanggal_lahir: userToEdit.tanggal_lahir || '',
                    alamat: userToEdit.alamat || ''
                });
            } else {
                setRole('siswa');
                setFormData(initialFormState);
            }
            setError(null);
        }
    }, [isOpen, userToEdit]);



    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleRoleChange = (e) => {
        setRole(e.target.value);
        setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const dataToSubmit = {
                role,
                ...formData
            };

            // Remove empty password if editing (so it doesn't overwrite with empty string)
            if (isEditMode && !dataToSubmit.password) {
                delete dataToSubmit.password;
            }

            if (isEditMode) {
                await userService.updateUser(userToEdit.uid, dataToSubmit);
            } else {
                await userService.createUser(dataToSubmit);
            }

            onSuccess();
            onClose();
        } catch (err) {
            console.error(err);
            setError(err.message || `Gagal ${isEditMode ? 'mengupdate' : 'membuat'} user`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden select-none">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                    <h2 className="text-xl font-bold text-gray-900">
                        {isEditMode ? 'Edit User' : 'Tambah User Baru'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-200 rounded-lg transition-colors text-gray-500 hover:text-gray-700"
                    >
                        <Icon icon="solar:close-circle-bold" className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
                    {error && (
                        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2 text-sm">
                            <Icon icon="solar:danger-circle-bold" className="w-5 h-5 flex-shrink-0" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Role Selection - Disable on Edit usually, or allow? Let's allow but warn if needed. existing logic didn't forbid. */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Role User</label>
                            <select
                                value={role}
                                onChange={handleRoleChange}
                                disabled={isEditMode} // Usually safer to not allow role change easily without proper migration
                                className={`w-full px-4 py-2.5 rounded-xl border border-gray-300 outline-none transition-all bg-white
                                    ${isEditMode ? 'bg-gray-100 cursor-not-allowed text-gray-500' : 'text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-green-500'}`}
                            >
                                <option value="siswa">Siswa</option>
                                <option value="teacher">Teacher</option>
                                <option value="admin">Admin</option>
                            </select>
                            {isEditMode && <p className="text-xs text-gray-400 mt-1">Role tidak dapat diubah saat edit.</p>}
                        </div>

                        {/* Common Fields */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                                <input
                                    type="text"
                                    name="nama"
                                    value={formData.nama}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                                    placeholder="Masukkan nama lengkap"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                                        placeholder="email@sekolah.id"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Password {isEditMode && <span className="text-gray-400 font-normal">(Opsional)</span>}
                                    </label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required={!isEditMode}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                                        placeholder={isEditMode ? "Biarkan kosong jika tetap" : "••••••••"}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Dynamic Fields based on Role */}
                        {role === 'siswa' && (
                            <div className="space-y-4 pt-2 border-t border-gray-100">
                                <div className="flex items-center gap-2 text-green-600 mb-2">
                                    <Icon icon="solar:user-id-bold" />
                                    <span className="text-sm font-semibold">Data Siswa</span>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Kelas</label>
                                    <input
                                        type="text"
                                        name="kelas"
                                        value={formData.kelas}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                                        placeholder="Contoh: X IPA 1"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Lahir</label>
                                    <input
                                        type="date"
                                        name="tanggal_lahir"
                                        value={formData.tanggal_lahir}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
                                    <textarea
                                        name="alamat"
                                        value={formData.alamat}
                                        onChange={handleChange}
                                        required
                                        rows="3"
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all resize-none"
                                        placeholder="Alamat lengkap siswa"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Submit Button */}
                        <div className="pt-4 flex gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={loading}
                                className="flex-1 px-4 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>Menyimpan...</span>
                                    </>
                                ) : (
                                    <>
                                        <Icon icon={isEditMode ? "solar:pen-bold" : "solar:check-circle-bold"} className="w-5 h-5" />
                                        <span>{isEditMode ? 'Simpan Perubahan' : 'Simpan User'}</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateUserModal;
