import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

export default function Dashboard() {
    const navigate = useNavigate();
    const user = authService.getCurrentUser();
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        // Get profile data from localStorage
        const profileData = localStorage.getItem('profile');
        if (profileData) {
            setProfile(JSON.parse(profileData));
        }
    }, []);

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-orange-400 to-orange-500 rounded-2xl shadow-lg p-6 sm:p-8 mb-6 sm:mb-8 text-white">
                <div className="flex items-center space-x-4">
                    {/* Avatar with Initials */}
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white bg-opacity-30 flex items-center justify-center text-white font-bold text-xl sm:text-2xl backdrop-blur-sm">
                        {profile?.nama?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div>
                        <h2 className="text-xl sm:text-2xl font-bold mb-1">
                            Selamat Datang, {profile?.nama || user?.email || 'User'}!
                        </h2>
                        <p className="text-green-100 text-sm sm:text-base">
                            Semangat belajar hari ini 🎓
                        </p>
                    </div>
                </div>
            </div>

            {/* Profile Info Card */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4 sm:p-6 mb-6 sm:mb-8">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Icon icon="solar:user-id-bold" className="w-5 h-5 text-orange-600 mr-2" />
                    Informasi Profil
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Nama</p>
                        <p className="font-semibold text-gray-900">{profile?.nama || '-'}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Email</p>
                        <p className="font-semibold text-gray-900 text-sm break-all">{profile?.email || user?.email || '-'}</p>
                    </div>
                    {profile?.kelas && (
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600 mb-1">Kelas</p>
                            <p className="font-semibold text-gray-900">{profile.kelas}</p>
                        </div>
                    )}
                    {profile?.tanggal_lahir && (
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600 mb-1">Tanggal Lahir</p>
                            <p className="font-semibold text-gray-900">
                                {new Date(profile.tanggal_lahir).toLocaleDateString('id-ID', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                })}
                            </p>
                        </div>
                    )}
                    {profile?.alamat && (
                        <div className="p-4 bg-gray-50 rounded-lg md:col-span-2">
                            <p className="text-sm text-gray-600 mb-1">Alamat</p>
                            <p className="font-semibold text-gray-900">{profile.alamat}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                <div
                    className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => navigate(user?.role === 'teacher' ? '/teacher/exams' : '/student/latihan')}
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                            <Icon icon="solar:document-text-bold" className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                        {user?.role === 'teacher' ? 'Kelola Latihan' : 'Ujian Tersedia'}
                    </h4>
                    <p className="text-sm text-gray-600 mb-4">
                        {user?.role === 'teacher' ? 'Kelola daftar latihan untuk siswa' : 'Lihat daftar ujian yang dapat Anda ikuti'}
                    </p>
                    <div className="text-sm text-green-600 hover:text-green-700 font-semibold flex items-center">
                        {user?.role === 'teacher' ? 'Kelola Latihan' : 'Lihat Ujian'}
                        <Icon icon="solar:alt-arrow-right-bold" className="w-4 h-4 ml-1" />
                    </div>
                </div>

                <div
                    className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => navigate(user?.role === 'teacher' ? '/teacher/ranking' : '/student/ranking')}
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                            <Icon icon="solar:chart-bold" className="w-6 h-6 text-orange-600" />
                        </div>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                        {user?.role === 'teacher' ? 'Leaderboard' : 'Riwayat Nilai'}
                    </h4>
                    <p className="text-sm text-gray-600 mb-4">
                        {user?.role === 'teacher' ? 'Lihat peringkat siswa berdasarkan nilai' : 'Cek hasil ujian yang telah Anda kerjakan'}
                    </p>
                    <div className="text-sm text-orange-600 hover:text-orange-700 font-semibold flex items-center">
                        {user?.role === 'teacher' ? 'Lihat Leaderboard' : 'Lihat Nilai'}
                        <Icon icon="solar:alt-arrow-right-bold" className="w-4 h-4 ml-1" />
                    </div>
                </div>

                <div
                    className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => navigate('/profile')}
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                            <Icon icon="solar:settings-bold" className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Profil</h4>
                    <p className="text-sm text-gray-600 mb-4">Kelola profil dan preferensi akun Anda</p>
                    <div className="text-sm text-blue-600 hover:text-blue-700 font-semibold flex items-center">
                        Lihat Profil
                        <Icon icon="solar:alt-arrow-right-bold" className="w-4 h-4 ml-1" />
                    </div>
                </div>
            </div>
        </div>
    );
}
