'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import StarRating from './StarRating';
import { BookItem } from '@/app/api/buku/route';

interface BookCardProps {
  book: BookItem;
  isWishlisted: boolean;
  onToggleWishlist: (book: BookItem) => Promise<void> | void;
  isWishlistLoading?: boolean;
}

export default function BookCard({
  book,
  isWishlisted,
  onToggleWishlist,
  isWishlistLoading = false,
}: BookCardProps) {
  const [imageError, setImageError] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleWishlistClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isProcessing || isWishlistLoading) return;

    try {
      setIsProcessing(true);
      await onToggleWishlist(book);
    } finally {
      setIsProcessing(false);
    }
  };

  const authorDisplay =
    book.authors && book.authors.length > 0
      ? book.authors.join(', ')
      : 'Penulis Tidak Diketahui';

  return (
    <div className="group relative flex flex-col sm:flex-row bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 hover:border-blue-400 dark:hover:border-blue-500">
      <div className="relative w-full sm:w-44 h-56 sm:h-auto shrink-0 bg-gray-100 dark:bg-zinc-800 flex items-center justify-center p-3 overflow-hidden">
        {book.thumbnail && !imageError ? (
          <Image
            fill
            src={book.thumbnail}
            alt={book.title}
            onError={() => setImageError(true)}
            className="w-full h-full object-contain max-h-52 drop-shadow-md group-hover:scale-105 transition-transform duration-200"
            loading="lazy"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-4 text-gray-400 dark:text-zinc-500">
            <svg
              className="w-12 h-12 mb-2 text-gray-300 dark:text-zinc-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            <span className="text-xs font-medium line-clamp-2 px-1">
              {book.title}
            </span>
            <span className="text-[10px] mt-1 text-gray-400">Tidak ada cover</span>
          </div>
        )}

        <button
          onClick={handleWishlistClick}
          disabled={isProcessing || isWishlistLoading}
          aria-label={isWishlisted ? 'Hapus dari Wishlist' : 'Tambah ke Wishlist'}
          className={`sm:hidden absolute top-2 right-2 p-2 rounded-full backdrop-blur-md transition-colors ${
            isWishlisted
              ? 'bg-rose-50 text-rose-600 shadow-sm'
              : 'bg-white/80 dark:bg-black/60 text-gray-600 dark:text-gray-300 hover:text-rose-500'
          }`}
        >
          <svg
            className={`w-5 h-5 transition-transform active:scale-75 ${
              isWishlisted ? 'fill-rose-500 stroke-rose-500' : 'fill-none stroke-current'
            }`}
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>
      </div>

      <div className="flex flex-col flex-1 p-5 justify-between gap-3">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-3">
            <h3
              className="text-base sm:text-lg font-bold text-gray-900 dark:text-white leading-snug line-clamp-2"
              title={book.title}
            >
              {book.title}
            </h3>

            <button
              onClick={handleWishlistClick}
              disabled={isProcessing || isWishlistLoading}
              aria-label={isWishlisted ? 'Hapus dari Wishlist' : 'Tambah ke Wishlist'}
              title={isWishlisted ? 'Hapus dari Wishlist' : 'Tambah ke Wishlist'}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                isWishlisted
                  ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900 hover:bg-rose-100'
                  : 'bg-gray-50 dark:bg-zinc-800 text-gray-600 dark:text-zinc-300 border border-gray-200 dark:border-zinc-700 hover:border-rose-300 hover:text-rose-600'
              }`}
            >
              <svg
                className={`w-4 h-4 transition-transform active:scale-75 ${
                  isWishlisted ? 'fill-rose-500 stroke-rose-500' : 'fill-none stroke-current'
                }`}
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <span>{isWishlisted ? 'Favorit' : 'Wishlist'}</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-600 dark:text-zinc-400">
            <svg
              className="w-4 h-4 shrink-0 text-gray-400 dark:text-zinc-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span className="line-clamp-1 font-medium">{authorDisplay}</span>
          </div>

          <div className="pt-1">
            <StarRating
              rating={book.averageRating}
              ratingsCount={book.ratingsCount}
              size="md"
            />
          </div>

          {book.description && (
            <p className="text-xs text-gray-500 dark:text-zinc-400 line-clamp-2 pt-1">
              {book.description}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-zinc-800 text-xs">
          <span className="text-gray-400 dark:text-zinc-500 font-mono text-[11px]">
            ID: {book.id.length > 12 ? `${book.id.substring(0, 10)}...` : book.id}
          </span>

          {book.previewLink && (
            <a
              href={book.previewLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium hover:underline"
            >
              <span>Lihat Detail</span>
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
