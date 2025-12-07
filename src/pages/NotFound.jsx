import { Link } from 'react-router-dom';
import { Button } from '../components/common';

const NotFound = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
            <div className="text-center">
                <h1 className="text-9xl font-bold text-white mb-4">404</h1>
                <h2 className="text-3xl font-bold text-white mb-4">Page Not Found</h2>
                <p className="text-slate-300 mb-8">
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <Link to="/">
                    <Button>Go to Home</Button>
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
