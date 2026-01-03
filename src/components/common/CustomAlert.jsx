import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';

const CustomAlert = ({ type = 'success', message, onClose, duration = 3000 }) => {
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            handleClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration]);

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(() => {
            onClose?.();
        }, 300);
    };

    const alertConfig = {
        success: {
            bgColor: 'from-green-500 to-emerald-600',
            icon: 'solar:check-circle-bold',
            iconColor: 'text-green-50'
        },
        error: {
            bgColor: 'from-red-500 to-rose-600',
            icon: 'solar:danger-circle-bold',
            iconColor: 'text-red-50'
        },
        warning: {
            bgColor: 'from-amber-500 to-orange-600',
            icon: 'solar:danger-triangle-bold',
            iconColor: 'text-amber-50'
        },
        info: {
            bgColor: 'from-blue-500 to-cyan-600',
            icon: 'solar:info-circle-bold',
            iconColor: 'text-blue-50'
        }
    };

    const config = alertConfig[type] || alertConfig.success;

    return (
        <div
            className={`
                fixed top-6 right-6 z-[9999]
                transform transition-all duration-300 ease-out
                ${isExiting ? 'translate-x-[500px] opacity-0' : 'translate-x-0 opacity-100'}
            `}
        >
            <div
                className={`
                    bg-gradient-to-r ${config.bgColor}
                    text-white
                    px-5 py-4 rounded-xl
                    shadow-2xl
                    flex items-center gap-4
                    min-w-[340px] max-w-md
                    relative
                    overflow-hidden
                `}
            >
                {/* Icon */}
                <div className="flex-shrink-0 p-2.5 bg-white/20 rounded-lg backdrop-blur-sm">
                    <Icon icon={config.icon} className="w-6 h-6" />
                </div>

                {/* Message */}
                <p className="flex-1 font-semibold text-sm leading-relaxed pr-2">
                    {message}
                </p>

                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="flex-shrink-0 p-1.5 hover:bg-white/20 rounded-lg transition-all duration-200 active:scale-95"
                    aria-label="Close"
                >
                    <Icon icon="solar:close-circle-bold" className="w-5 h-5" />
                </button>

                {/* Progress Bar */}
                <div
                    className="absolute bottom-0 left-0 h-1 bg-white/40 rounded-full"
                    style={{
                        width: '100%',
                        animation: `shrink ${duration}ms linear forwards`
                    }}
                />
            </div>

            <style>{`
                @keyframes shrink {
                    from { width: 100%; }
                    to { width: 0%; }
                }
            `}</style>
        </div>
    );
};

export default CustomAlert;
