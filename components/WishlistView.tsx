'use client';

import BookCard from './BookCard';
import { BookItem } from '@/app/api/buku/route';

interface WishlistViewProps {
  wishlist: BookItem[];
  isLoading: boolean;
  onRemoveFromWishlist: (book: BookItem) => Promise<void> | void;
  onSwitchToSearch: () => void;
}

export default function WishlistView({
  wishlist,
  isLoading,
  onRemoveFromWishlist,
  onSwitchToSearch,
}: WishlistViewProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <svg
          className="animate-spin w-8 h-8 text-blue-600 mb-3"
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
        <p className="text-sm text-gray-500 dark:text-zinc-400">
          Memuat daftar buku wishlist...
        </p>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl max-w-xl mx-auto shadow-xs">
        <div className="w-16 h-16 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-500 dark:text-rose-400 flex items-center justify-center mb-4">
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
          Wishlist Masih Kosong
        </h3>
        <button
          onClick={onSwitchToSearch}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-2"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <span>Mulai Cari Buku</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-gray-200 dark:border-zinc-800">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Buku Favorit Saya
          </h2>
        </div>
        <span className="px-3 py-1 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-semibold rounded-full border border-rose-200 dark:border-rose-900">
          {wishlist.length} Tersimpan
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {wishlist.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            isWishlisted={true}
            onToggleWishlist={onRemoveFromWishlist}
          />
        ))}
      </div>
    </div>
  );
}
