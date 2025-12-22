import { useState, useEffect } from 'react';
import userService from '../../services/userService';
import { Icon } from '@iconify/react';
import CreateUserModal from '../../components/admin/CreateUserModal';
import ConfirmationModal from '../../components/common/ConfirmationModal';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [userToEdit, setUserToEdit] = useState(null);

    // Delete Confirmation State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await userService.getAllUsers();
            if (response.success) {
                console.log('Fetched users:', response.data);
                setUsers(response.data);
            }
        } catch (err) {
            setError(err.message || 'Gagal memuat data user');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateSuccess = () => {
        fetchUsers();
        setUserToEdit(null);
    };

    const handleEdit = (user) => {
        setUserToEdit(user);
        setIsCreateModalOpen(true);
    };

    const confirmDelete = (user) => {
        setUserToDelete(user);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (!userToDelete) return;

        try {
            setIsDeleting(true);
            await userService.deleteUser(userToDelete.uid);

            // Close modal and refresh list
            setIsDeleteModalOpen(false);
            setUserToDelete(null);
            fetchUsers();
        } catch (err) {
            console.error(err);
            // Optionally show error toast/alert here, existing error state handles main load errors
            alert(err.message || 'Gagal menghapus user');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleModalClose = () => {
        setIsCreateModalOpen(false);
        setUserToEdit(null);
    };

    if (loading && users.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-3">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
                    <p className="text-gray-500 text-sm animate-pulse">Memuat data user...</p>
                </div>
            </div>
        );
    }

    if (error && users.length === 0) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl flex items-center gap-3">
                <Icon icon="solar:danger-circle-bold" className="w-6 h-6 flex-shrink-0" />
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 p-6 bg-brand-green min-h-screen text-white">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Manajemen User</h1>
                    <p className="text-green-50 text-sm mt-1">Kelola data seluruh pengguna sistem CBT</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-xl border border-gray-200 shadow-sm">
                        <div className="p-2 bg-orange-50 rounded-lg">
                            <Icon icon="solar:users-group-rounded-bold" className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Total Users</p>
                            <p className="text-lg font-bold text-gray-900 leading-none">{users.length}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            setUserToEdit(null);
                            setIsCreateModalOpen(true);
                        }}
                        className="flex items-center gap-2 bg-brand-orange hover:bg-orange-600 text-white px-5 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
                    >
                        <Icon icon="solar:user-plus-bold" className="w-5 h-5" />
                        <span>Tambah User</span>
                    </button>
                </div>
            </div>

            {/* Table Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden ring-1 ring-black/5">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">No</th>
                                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">User Info</th>
                                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Kontak</th>
                                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Role</th>
                                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                            {users.map((user, index) => (
                                <tr
                                    key={user.uid}
                                    className="group hover:bg-gray-50/80 transition-all duration-200"
                                >
                                    <td className="px-8 py-4 text-sm text-gray-400 font-medium w-16">
                                        {(index + 1).toString().padStart(2, '0')}
                                    </td>
                                    <td className="px-8 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm
                                                ${user.role === 'admin' ? 'bg-gradient-to-br from-purple-500 to-purple-600' :
                                                    user.role === 'teacher' ? 'bg-gradient-to-br from-orange-500 to-orange-600' :
                                                        'bg-gradient-to-br from-green-500 to-green-600'}`}>
                                                {user.nama?.charAt(0).toUpperCase() || 'U'}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-gray-900 group-hover:text-green-700 transition-colors">
                                                    {user.nama}
                                                </p>
                                                <p className="text-xs text-gray-400 font-medium">ID: {user.uid.slice(0, 8)}...</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-4">
                                        <div className="flex items-center gap-2 text-gray-500">
                                            <Icon icon="solar:letter-linear" className="w-4 h-4" />
                                            <span className="text-sm">{user.email}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-4">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border shadow-sm
                                            ${user.role === 'admin'
                                                ? 'bg-purple-50 text-purple-700 border-purple-100'
                                                : user.role === 'teacher'
                                                    ? 'bg-orange-50 text-orange-700 border-orange-100'
                                                    : 'bg-green-50 text-green-700 border-green-100'}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full mr-2
                                                ${user.role === 'admin' ? 'bg-purple-500' :
                                                    user.role === 'teacher' ? 'bg-orange-500' :
                                                        'bg-green-500'}`}></span>
                                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-8 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleEdit(user)}
                                                className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 group-hover:shadow-sm"
                                                title="Edit User"
                                            >
                                                <Icon icon="solar:pen-bold" className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => confirmDelete(user)}
                                                className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all duration-200 group-hover:shadow-sm"
                                                title="Hapus User"
                                            >
                                                <Icon icon="solar:trash-bin-trash-bold" className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-8 py-16 text-center">
                                        <div className="flex flex-col items-center justify-center text-gray-400">
                                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                                <Icon icon="solar:users-group-rounded-linear" className="w-8 h-8" />
                                            </div>
                                            <p className="text-base font-medium text-gray-600">Belum ada data user</p>
                                            <p className="text-sm mt-1">Buat user baru dengan tombol di atas</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <CreateUserModal
                key={userToEdit ? userToEdit.uid : 'create-new'}
                isOpen={isCreateModalOpen}
                onClose={handleModalClose}
                onSuccess={handleCreateSuccess}
                userToEdit={userToEdit}
            />

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title="Hapus User"
                message={`Anda yakin ingin menghapus user "${userToDelete?.nama}"? Tindakan ini tidak dapat dibatalkan.`}
                confirmText="Hapus User"
                variant="danger"
                isLoading={isDeleting}
            />
        </div>
    );
};

export default Users;
