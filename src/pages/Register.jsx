import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
    const navigate = useNavigate();
    const { register } = useAuth();

    // Step management
    const [step, setStep] = useState(1); // 1: Select Role, 2: Fill Form
    const [selectedRole, setSelectedRole] = useState('');

    //Form data
    const [formData, setFormData] = useState({
        role: '',
        nama: '',
        email: '',
        password: '',
        confirmPassword: '',
        nis: '',
        tanggal_lahir: '',
        kelas: '',
        alamat: '',
        nip: '',
        image: null
    });

    const [imagePreview, setImagePreview] = useState(null);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState('');

    const roles = [
        { value: 'siswa', label: 'Siswa', icon: '🎓', color: 'green' },
        { value: 'teacher', label: 'Guru', icon: '👨‍🏫', color: 'blue' },
        { value: 'admin', label: 'Admin', icon: '⚙️', color: 'purple' }
    ];

    const handleRoleSelect = (role) => {
        setSelectedRole(role);
        setFormData(prev => ({ ...prev, role }));
        setStep(2);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
        setServerError('');
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                setErrors(prev => ({ ...prev, image: 'File harus berupa gambar' }));
                return;
            }

            // Validate file size (max 2MB)
            if (file.size > 2 * 1024 * 1024) {
                setErrors(prev => ({ ...prev, image: 'Ukuran file maksimal 2MB' }));
                return;
            }

            // Convert to base64
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, image: reader.result }));
                setImagePreview(reader.result);
                setErrors(prev => ({ ...prev, image: '' }));
            };
            reader.readAsDataURL(file);
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Common validation
        if (!formData.nama.trim()) newErrors.nama = 'Nama harus diisi';
        if (!formData.email.trim()) {
            newErrors.email = 'Email harus diisi';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Format email tidak valid';
        }
        if (!formData.password) {
            newErrors.password = 'Password harus diisi';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password minimal 6 karakter';
        }
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Password tidak cocok';
        }

        // Role-specific validation
        if (selectedRole === 'siswa') {
            if (!formData.nis.trim()) newErrors.nis = 'NIS harus diisi';
            if (!formData.tanggal_lahir) newErrors.tanggal_lahir = 'Tanggal lahir harus diisi';
            if (!formData.kelas.trim()) newErrors.kelas = 'Kelas harus diisi';
            if (!formData.alamat.trim()) newErrors.alamat = 'Alamat harus diisi';
        }

        if (selectedRole === 'teacher') {
            if (!formData.nip.trim()) newErrors.nip = 'NIP harus diisi';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError('');

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            const submitData = {
                role: formData.role,
                nama: formData.nama,
                email: formData.email,
                password: formData.password,
                image: formData.image
            };

            if (selectedRole === 'siswa') {
                submitData.nis = formData.nis;
                submitData.tanggal_lahir = formData.tanggal_lahir;
                submitData.kelas = formData.kelas;
                submitData.alamat = formData.alamat;
            } else if (selectedRole === 'teacher') {
                submitData.nip = formData.nip;
            }

            await register(submitData);
            navigate('/dashboard');
        } catch (error) {
            console.error('Registration error:', error);
            setServerError(error.message || 'Registrasi gagal. Silakan coba lagi.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
            <div className="max-w-4xl w-full">
                {/* Logo Section */}
                <div className="text-center mb-8">
                    <img src="/images/logo.png" alt="Logo" className="w-20 h-20 mb-4 object-contain" />
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Daftar Akun Baru</h1>
                    <p className="text-gray-600">Buat akun CBT Anda</p>
                </div>

                {/* Step 1: Role Selection */}
                {step === 1 && (
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Pilih Role Anda</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {roles.map((role) => (
                                <button
                                    key={role.value}
                                    onClick={() => handleRoleSelect(role.value)}
                                    className={`p-6 rounded-xl border-2 hover:shadow-lg transition-all ${role.color === 'green' ? 'border-green-200 hover:border-green-500 hover:bg-green-50' :
                                        role.color === 'blue' ? 'border-blue-200 hover:border-blue-500 hover:bg-blue-50' :
                                            'border-purple-200 hover:border-purple-500 hover:bg-purple-50'
                                        }`}
                                >
                                    <div className="text-5xl mb-3">{role.icon}</div>
                                    <h3 className="text-lg font-semibold text-gray-900">{role.label}</h3>
                                </button>
                            ))}
                        </div>

                        {/* Login Link */}
                        <div className="mt-6 text-center">
                            <p className="text-gray-600 text-sm">
                                Sudah punya akun?{' '}
                                <Link to="/login" className="text-orange-600 hover:text-orange-700 font-semibold transition-colors">
                                    Masuk Sekarang
                                </Link>
                            </p>
                        </div>
                    </div>
                )}

                {/* Step 2: Registration Form */}
                {step === 2 && (
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                        {/* Back Button */}
                        <button
                            onClick={() => {
                                setStep(1);
                                setSelectedRole('');
                                setFormData({ ...formData, role: '' });
                            }}
                            className="mb-4 text-gray-600 hover:text-gray-900 flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Kembali
                        </button>

                        <h2 className="text-xl font-bold text-gray-900 mb-6">
                            Daftar sebagai {roles.find(r => r.value === selectedRole)?.label}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {serverError && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                    {serverError}
                                </div>
                            )}

                            {/* Image Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Foto Profil
                                </label>
                                <div className="flex items-center gap-4">
                                    <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                            id="image-upload"
                                            disabled={isLoading}
                                        />
                                        <label
                                            htmlFor="image-upload"
                                            className="inline-block px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
                                        >
                                            Pilih Foto
                                        </label>
                                        <p className="text-xs text-gray-500 mt-1">PNG atau JPG (maks. 2MB)</p>
                                        {errors.image && <p className="text-sm text-red-600 mt-1">{errors.image}</p>}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Common Fields */}
                                <div>
                                    <label htmlFor="nama" className="block text-sm font-medium text-gray-700 mb-2">
                                        Nama Lengkap *
                                    </label>
                                    <input
                                        type="text"
                                        id="nama"
                                        name="nama"
                                        value={formData.nama}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 border ${errors.nama ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none`}
                                        disabled={isLoading}
                                    />
                                    {errors.nama && <p className="mt-1 text-sm text-red-600">{errors.nama}</p>}
                                </div>

                                {/* Siswa: NIS */}
                                {selectedRole === 'siswa' && (
                                    <div>
                                        <label htmlFor="nis" className="block text-sm font-medium text-gray-700 mb-2">
                                            NIS *
                                        </label>
                                        <input
                                            type="text"
                                            id="nis"
                                            name="nis"
                                            value={formData.nis}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-3 border ${errors.nis ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none`}
                                            disabled={isLoading}
                                        />
                                        {errors.nis && <p className="mt-1 text-sm text-red-600">{errors.nis}</p>}
                                    </div>
                                )}

                                {/* Teacher: NIP */}
                                {selectedRole === 'teacher' && (
                                    <div>
                                        <label htmlFor="nip" className="block text-sm font-medium text-gray-700 mb-2">
                                            NIP *
                                        </label>
                                        <input
                                            type="text"
                                            id="nip"
                                            name="nip"
                                            value={formData.nip}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-3 border ${errors.nip ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none`}
                                            disabled={isLoading}
                                        />
                                        {errors.nip && <p className="mt-1 text-sm text-red-600">{errors.nip}</p>}
                                    </div>
                                )}

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 border ${errors.email ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none`}
                                        disabled={isLoading}
                                    />
                                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                                </div>

                                {/* Siswa Only Fields */}
                                {selectedRole === 'siswa' && (
                                    <>
                                        <div>
                                            <label htmlFor="tanggal_lahir" className="block text-sm font-medium text-gray-700 mb-2">
                                                Tanggal Lahir *
                                            </label>
                                            <input
                                                type="date"
                                                id="tanggal_lahir"
                                                name="tanggal_lahir"
                                                value={formData.tanggal_lahir}
                                                onChange={handleChange}
                                                className={`w-full px-4 py-3 border ${errors.tanggal_lahir ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none`}
                                                disabled={isLoading}
                                            />
                                            {errors.tanggal_lahir && <p className="mt-1 text-sm text-red-600">{errors.tanggal_lahir}</p>}
                                        </div>

                                        <div>
                                            <label htmlFor="kelas" className="block text-sm font-medium text-gray-700 mb-2">
                                                Kelas *
                                            </label>
                                            <input
                                                type="text"
                                                id="kelas"
                                                name="kelas"
                                                value={formData.kelas}
                                                onChange={handleChange}
                                                placeholder="Contoh: 12A"
                                                className={`w-full px-4 py-3 border ${errors.kelas ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none`}
                                                disabled={isLoading}
                                            />
                                            {errors.kelas && <p className="mt-1 text-sm text-red-600">{errors.kelas}</p>}
                                        </div>
                                    </>
                                )}

                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                        Password *
                                    </label>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 border ${errors.password ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none`}
                                        disabled={isLoading}
                                    />
                                    {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                                </div>

                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                        Konfirmasi Password *
                                    </label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 border ${errors.confirmPassword ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none`}
                                        disabled={isLoading}
                                    />
                                    {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
                                </div>
                            </div>

                            {/* Siswa: Alamat (Full Width) */}
                            {selectedRole === 'siswa' && (
                                <div>
                                    <label htmlFor="alamat" className="block text-sm font-medium text-gray-700 mb-2">
                                        Alamat *
                                    </label>
                                    <textarea
                                        id="alamat"
                                        name="alamat"
                                        value={formData.alamat}
                                        onChange={handleChange}
                                        rows={3}
                                        className={`w-full px-4 py-3 border ${errors.alamat ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none resize-none`}
                                        disabled={isLoading}
                                    />
                                    {errors.alamat && <p className="mt-1 text-sm text-red-600">{errors.alamat}</p>}
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Memproses...
                                    </span>
                                ) : (
                                    'Daftar'
                                )}
                            </button>
                        </form>
                    </div>
                )}

                {/* Footer */}
                <p className="text-center text-gray-500 text-sm mt-8">
                    © 2024 TPQ Husnul Khotimah. All rights reserved.
                </p>
            </div>
        </div>
    );
}
