import { Card } from '../components/common';

const Dashboard = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
                <p className="text-slate-300">Welcome to your CBT dashboard</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Stats Cards */}
                <Card>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-400 text-sm">Total Tests</p>
                            <p className="text-3xl font-bold text-white mt-1">12</p>
                        </div>
                        <div className="bg-purple-500/20 rounded-xl p-3">
                            <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                    </div>
                </Card>

                <Card>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-400 text-sm">Completed</p>
                            <p className="text-3xl font-bold text-white mt-1">8</p>
                        </div>
                        <div className="bg-green-500/20 rounded-xl p-3">
                            <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </Card>

                <Card>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-400 text-sm">Average Score</p>
                            <p className="text-3xl font-bold text-white mt-1">85%</p>
                        </div>
                        <div className="bg-blue-500/20 rounded-xl p-3">
                            <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Recent Tests */}
            <div className="mt-8">
                <Card>
                    <h2 className="text-2xl font-bold text-white mb-4">Recent Tests</h2>
                    <div className="space-y-4">
                        {[1, 2, 3].map((item) => (
                            <div key={item} className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition">
                                <div>
                                    <h3 className="text-white font-semibold">Test #{item}</h3>
                                    <p className="text-slate-400 text-sm">Completed on Dec {item}, 2025</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-purple-400">90%</p>
                                    <p className="text-slate-400 text-sm">Score</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
