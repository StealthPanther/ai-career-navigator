'use client';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
            <div className="bg-white p-8 rounded-xl shadow-lg max-w-md text-center">
                <div className="flex justify-center mb-4 text-red-500 text-6xl">⚠️</div>
                <h2 className="text-2xl font-bold mb-2 text-gray-900">Something went wrong</h2>
                <p className="text-gray-600 mb-6">
                    {error.message || 'An unexpected error occurred'}
                </p>
                <button
                    onClick={reset}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                    🔄 Try Again
                </button>
            </div>
        </div>
    );
}
