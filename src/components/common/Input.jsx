const Input = ({
    label,
    error,
    icon: Icon,
    className = '',
    ...props
}) => {
    return (
        <div className="space-y-2">
            {label && (
                <label className="block text-sm font-medium text-slate-200">
                    {label}
                </label>
            )}
            <div className="relative">
                {Icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Icon className="h-5 w-5 text-slate-400" />
                    </div>
                )}
                <input
                    className={`
            block w-full ${Icon ? 'pl-10' : 'pl-3'} pr-3 py-3 
            bg-white/5 border border-white/10 rounded-xl 
            text-white placeholder-slate-400 
            focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent 
            transition duration-200
            ${error ? 'border-red-500 focus:ring-red-500' : ''}
            ${className}
          `}
                    {...props}
                />
            </div>
            {error && (
                <p className="text-sm text-red-400">{error}</p>
            )}
        </div>
    );
};

export default Input;
