import { Link } from '@inertiajs/react';

export default function Welcome() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
            <div className="text-center max-w-2xl px-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    Welcome
                </h1>
                <p className="text-lg text-gray-600 mb-8">
                    You're running Laravel with Inertia.js and React.
                </p>
                <nav className="flex gap-4 justify-center flex-wrap">
                    <Link
                        href="/admin"
                        className="px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition"
                    >
                        Admin Panel
                    </Link>
                    <Link
                        href="/agent/login"
                        className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-100 transition"
                    >
                        Agent Login
                    </Link>
                </nav>
            </div>
        </div>
    );
}
