const Card = ({ children, className = '', ...props }) => {
    return (
        <div
            className={`bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-white/20 ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

export default Card;
