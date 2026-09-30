'use client';

import React from 'react';

interface SearchBarProps {
  query: string;
  setQuery: (q: string) => void;
  onSearch: (e?: React.FormEvent) => void;
  isLoading: boolean;
}

export default function SearchBar({
  query,
  setQuery,
  onSearch,
  isLoading,
}: SearchBarProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(e);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-3">
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <div className="absolute left-4 text-gray-400 dark:text-zinc-500 pointer-events-none">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari buku berdasarkan judul, topik, atau pengarang..."
          className="w-full pl-12 pr-28 py-3.5 bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base shadow-sm transition-all"
        />

        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute right-24 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300 rounded-full"
            title="Hapus pencarian"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}

        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="absolute right-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-gray-300 dark:disabled:bg-zinc-800 text-white text-sm font-medium rounded-xl transition-all shadow-xs cursor-pointer disabled:cursor-not-allowed flex items-center gap-1.5"
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin w-4 h-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span className="hidden sm:inline">Mencari...</span>
            </>
          ) : (
            <span>Cari</span>
          )}
        </button>
      </form>
    </div>
  );
}
