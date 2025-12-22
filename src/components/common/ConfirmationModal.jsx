import { Icon } from '@iconify/react';

const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Konfirmasi',
    cancelText = 'Batal',
    variant = 'danger', // danger, warning, info
    isLoading = false
}) => {
    if (!isOpen) return null;

    const variantStyles = {
        danger: {
            icon: 'solar:danger-triangle-bold',
            iconColor: 'text-red-600',
            bgIcon: 'bg-red-50',
            button: 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
        },
        warning: {
            icon: 'solar:shield-warning-bold',
            iconColor: 'text-orange-600',
            bgIcon: 'bg-orange-50',
            button: 'bg-orange-600 hover:bg-orange-700 focus:ring-orange-500'
        },
        info: {
            icon: 'solar:info-circle-bold',
            iconColor: 'text-blue-600',
            bgIcon: 'bg-blue-50',
            button: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
        }
    };

    const style = variantStyles[variant] || variantStyles.info;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl overflow-hidden transform transition-all scale-100">
                <div className="p-6 text-center">
                    <div className={`w-16 h-16 ${style.bgIcon} rounded-full flex items-center justify-center mx-auto mb-4`}>
                        <Icon icon={style.icon} className={`w-8 h-8 ${style.iconColor}`} />
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
                    <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                        {message}
                    </p>

                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            disabled={isLoading}
                            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isLoading}
                            className={`flex-1 px-4 py-2.5 rounded-xl text-white font-medium shadow-md hover:shadow-lg transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${style.button}`}
                        >
                            {isLoading ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <span>{confirmText}</span>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
