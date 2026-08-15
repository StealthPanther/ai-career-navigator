'use client';

import Stamp from '@/components/logbook/Stamp';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-paper p-4 font-sans text-ink">
            <div className="relative w-full max-w-md border-2 border-ink bg-paper-2 p-8 text-center shadow-[8px_10px_0_-4px_hsl(var(--stamp))]">
                <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-ink-2">
                    the career logbook · errata
                </p>
                <div className="mt-4 font-serif text-6xl font-black text-stamp">✎</div>
                <h2 className="mt-3 font-serif text-2xl font-bold text-ink">
                    A page came out wrong.
                </h2>
                <p className="mt-2 text-sm text-ink-2">
                    {error.message || 'An unexpected error occurred while printing.'}
                </p>
                <button
                    onClick={reset}
                    className="btn-hard mt-6 bg-ink px-6 py-3 font-sans text-xs font-semibold uppercase tracking-[0.22em] text-paper-2"
                >
                    Reprint this page
                </button>
                <div className="mt-6 flex justify-center">
                    <Stamp tone="red" flat>
                        Erratum
                    </Stamp>
                </div>
            </div>
        </div>
    );
}
