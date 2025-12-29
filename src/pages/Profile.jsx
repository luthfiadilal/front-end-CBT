import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';

const InputField = ({ label, name, type = "text", value, onChange, icon, disabled = false, required = false }) => (
    <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon icon={icon} className="text-gray-400 w-5 h-5" />
            </div>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                disabled={disabled}
                required={required}
                className={`block w-full pl-10 pr-3 py-2 border ${disabled ? 'bg-gray-100 text-gray-500' : 'bg-white text-gray-900'} border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm`}
            />
        </div>
    </div>
);

const Profile = () => {
    const { user, profile } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const [formData, setFormData] = useState({
        nama: '',
        email: '',
        // Siswa fields
        kelas: '',
        tanggal_lahir: '',
        alamat: ''
    });

    useEffect(() => {
        if (profile) {
            setFormData({
                nama: profile.nama || '',
                email: profile.email || '',
                kelas: profile.kelas || '',
                tanggal_lahir: profile.tanggal_lahir || '',
                alamat: profile.alamat || ''
            });
        }
    }, [profile]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            const data = new FormData();
            data.append('nama', formData.nama);

            // Add role specific fields
            if (user?.role === 'siswa') {
                data.append('kelas', formData.kelas);
                data.append('tanggal_lahir', formData.tanggal_lahir);
                data.append('alamat', formData.alamat);
            }

            await authService.updateProfile(data);

            setSuccessMessage('Profile berhasil diperbarui!');
            setIsEditing(false);

            window.location.reload();

        } catch (err) {
            console.error(err);
            setError(err.message || 'Gagal memperbarui profile');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-xl overflow-hidden"
            >
                {/* Header / Cover */}
                <div className="h-32 bg-gradient-to-r from-orange-400 to-orange-500 relative"></div>

                <div className="px-8 pb-8">
                    <div className="relative flex justify-between items-end -mt-12 mb-6">
                        <div className="flex items-end">
                            {/* Avatar with Initials - matching Sidebar style */}
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-600 to-green-700 flex items-center justify-center text-white text-3xl font-bold border-4 border-white shadow-lg">
                                {formData.nama?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                            <div className="ml-6 mb-2">
                                <h1 className="text-3xl font-bold text-gray-900">{profile?.nama}</h1>
                                <p className="text-emerald-600 font-medium capitalize">{user?.role}</p>
                            </div>
                        </div>

                        {!isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
                            >
                                <Icon icon="solar:pen-bold" className="mr-2 w-5 h-5" /> Edit Profile
                            </button>
                        )}
                    </div>

                    {/* Messages */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg">
                            {error}
                        </div>
                    )}
                    {successMessage && (
                        <div className="mb-6 p-4 bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700 rounded-lg">
                            {successMessage}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Left Column: Basic Info */}
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Informasi Akun</h3>

                                <InputField
                                    label="Nama Lengkap"
                                    name="nama"
                                    value={formData.nama}
                                    onChange={handleChange}
                                    icon="solar:user-bold"
                                    disabled={!isEditing}
                                    required
                                />

                                <InputField
                                    label="Email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    icon="solar:letter-bold"
                                    disabled={true} // Email usually not editable directly
                                />
                            </div>

                            {/* Right Column: Role Specific Info */}
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Detail Data</h3>

                                {user?.role === 'siswa' && (
                                    <>
                                        <InputField
                                            label="Kelas"
                                            name="kelas"
                                            value={formData.kelas}
                                            onChange={handleChange}
                                            icon="solar:book-bold"
                                            disabled={!isEditing}
                                            required
                                        />
                                        <InputField
                                            label="Tanggal Lahir"
                                            name="tanggal_lahir"
                                            type="date"
                                            value={formData.tanggal_lahir}
                                            onChange={handleChange}
                                            icon="solar:calendar-bold"
                                            disabled={!isEditing}
                                            required
                                        />
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
                                            <div className="relative">
                                                <div className="absolute top-3 left-3 pointer-events-none">
                                                    <Icon icon="solar:map-point-bold" className="text-gray-400 w-5 h-5" />
                                                </div>
                                                <textarea
                                                    name="alamat"
                                                    value={formData.alamat}
                                                    onChange={handleChange}
                                                    disabled={!isEditing}
                                                    required
                                                    rows="3"
                                                    className={`block w-full pl-10 pr-3 py-2 border ${!isEditing ? 'bg-gray-100 text-gray-500' : 'bg-white text-gray-900'} border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm`}
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}

                                {user?.role === 'teacher' && (
                                    <div className="text-gray-500 italic">
                                        Tidak ada data tambahan untuk Teacher.
                                    </div>
                                )}

                                {user?.role === 'admin' && (
                                    <div className="text-gray-500 italic">
                                        Tidak ada data tambahan untuk Admin.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        {isEditing && (
                            <div className="mt-8 flex justify-end space-x-4 pt-6 border-t">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsEditing(false);
                                        setError('');
                                        // Reset form to profile state
                                        setFormData({
                                            nama: profile.nama || '',
                                            email: profile.email || '',
                                            kelas: profile.kelas || '',
                                            tanggal_lahir: profile.tanggal_lahir || '',
                                            alamat: profile.alamat || ''
                                        });
                                    }}
                                    className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 bg-white rounded-lg hover:bg-gray-50 transition-colors"
                                    disabled={isLoading}
                                >
                                    <Icon icon="solar:close-circle-bold" className="mr-2 w-5 h-5" /> Batal
                                </button>
                                <button
                                    type="submit"
                                    className="flex items-center px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Menyimpan...' : (
                                        <>
                                            <Icon icon="solar:disk-bold" className="mr-2 w-5 h-5" /> Simpan Perubahan
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default Profile;
