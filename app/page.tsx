'use client';

import React, { useState, useEffect, useCallback } from 'react';
import SearchBar from '@/components/SearchBar';
import BookCard from '@/components/BookCard';
import WishlistView from '@/components/WishlistView';
import { BookItem } from './api/buku/route';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'search' | 'wishlist'>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [books, setBooks] = useState<BookItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const [wishlist, setWishlist] = useState<BookItem[]>([]);
  const [isWishlistLoading, setIsWishlistLoading] = useState(true);

  const [toast, setToast] = useState<{
    text: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);

  const showToast = (
    text: string,
    type: 'success' | 'error' | 'info' = 'success'
  ) => {
    setToast({ text, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const fetchWishlist = useCallback(async () => {
    try {
      setIsWishlistLoading(true);
      const res = await fetch('/api/wishlist');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        const mapped = data.data.map((item: any) => ({
          id: item.bookId || item._id,
          title: item.title,
          authors: item.authors || [],
          thumbnail: item.thumbnail || '',
          averageRating: item.averageRating || 0,
          ratingsCount: item.ratingsCount || 0,
          description: item.description || '',
          previewLink: item.previewLink || '',
        }));
        setWishlist(mapped);
      }
    } catch (err) {
      console.error('Gagal mengambil wishlist:', err);
      showToast('Gagal memuat wishlist dari MongoDB', 'error');
    } finally {
      setIsWishlistLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;

    setIsSearching(true);
    setSearchError(null);
    setHasSearched(true);

    try {
      const res = await fetch(`/api/buku?q=${encodeURIComponent(q)}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Terjadi kesalahan saat mencari buku');
      }

      setBooks(data.items || []);
    } catch (err) {
      console.error('Search error:', err);
      setSearchError(
        (err as Error).message || 'Gagal terhubung ke layanan pencarian buku'
      );
      setBooks([]);
    } finally {
      setIsSearching(false);
    }
  };

  const isBookWishlisted = (bookId: string) => {
    return wishlist.some((item) => item.id === bookId);
  };

  const handleToggleWishlist = async (book: BookItem) => {
    const isCurrentlyWishlisted = isBookWishlisted(book.id);

    if (isCurrentlyWishlisted) {
      setWishlist((prev) => prev.filter((item) => item.id !== book.id));

      try {
        const res = await fetch(
          `/api/wishlist?bookId=${encodeURIComponent(book.id)}`,
          {
            method: 'DELETE',
          }
        );
        const data = await res.json();
        if (data.success) {
          showToast(`"${book.title}" dihapus dari wishlist`, 'info');
        } else {
          fetchWishlist();
          showToast(data.error || 'Gagal menghapus buku', 'error');
        }
      } catch (err) {
        console.error('Error deleting wishlist item:', err);
        fetchWishlist();
        showToast('Terjadi kesalahan saat menghapus dari database', 'error');
      }
    } else {
      setWishlist((prev) => [book, ...prev]);

      try {
        const res = await fetch('/api/wishlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            bookId: book.id,
            title: book.title,
            authors: book.authors,
            thumbnail: book.thumbnail,
            averageRating: book.averageRating,
            ratingsCount: book.ratingsCount,
            description: book.description,
            previewLink: book.previewLink,
          }),
        });

        const data = await res.json();
        if (data.success) {
          showToast(`"${book.title}" disimpan ke wishlist!`, 'success');
        } else {
          fetchWishlist();
          showToast(data.error || 'Gagal menyimpan ke wishlist', 'error');
        }
      } catch (err) {
        console.error('Error adding wishlist item:', err);
        fetchWishlist();
        showToast('Terjadi kesalahan saat menyimpan ke database', 'error');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/60 dark:bg-black text-gray-900 dark:text-zinc-100 flex flex-col">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium animate-bounce transition-all bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white">
          {toast.type === 'success' && (
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
          )}
          {toast.type === 'info' && (
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0" />
          )}
          {toast.type === 'error' && (
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
          )}
          <span className="max-w-xs truncate">{toast.text}</span>
        </div>
      )}

      <header className="sticky top-0 z-40 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-gray-200 dark:border-zinc-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold leading-tight tracking-tight">
                Pencari Buku
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-gray-100 dark:bg-zinc-900 p-1 rounded-xl border border-gray-200 dark:border-zinc-800">
            <button
              onClick={() => setActiveTab('search')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'search'
                  ? 'bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white'
              }`}
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
              <span>Cari Buku</span>
            </button>

            <button
              onClick={() => setActiveTab('wishlist')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'wishlist'
                  ? 'bg-white dark:bg-zinc-800 text-rose-600 dark:text-rose-400 shadow-xs'
                  : 'text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <svg
                className={`w-4 h-4 ${
                  wishlist.length > 0 ? 'fill-rose-500 stroke-rose-500' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <span>Wishlist</span>
              {wishlist.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-500 text-white leading-none">
                  {wishlist.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8">
        {activeTab === 'search' ? (
          <div className="space-y-8">
            <div className="text-center space-y-2 py-4">
              <p className="text-sm text-gray-500 dark:text-zinc-400 max-w-md mx-auto">
                Search
              </p>
              <div className="pt-3">
                <SearchBar
                  query={searchQuery}
                  setQuery={setSearchQuery}
                  onSearch={handleSearch}
                  isLoading={isSearching}
                />
              </div>
            </div>

            {searchError && (
              <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-400 text-sm flex items-center gap-3 max-w-3xl mx-auto">
                <svg
                  className="w-5 h-5 shrink-0 text-rose-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{searchError}</span>
              </div>
            )}

            <div>
              {isSearching && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((n) => (
                    <div
                      key={n}
                      className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-4 flex gap-4 animate-pulse"
                    >
                      <div className="w-28 h-36 bg-gray-200 dark:bg-zinc-800 rounded-lg shrink-0" />
                      <div className="flex-1 space-y-3 py-1">
                        <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded-sm w-3/4" />
                        <div className="h-3 bg-gray-200 dark:bg-zinc-800 rounded-sm w-1/2" />
                        <div className="h-3 bg-gray-200 dark:bg-zinc-800 rounded-sm w-1/3" />
                        <div className="h-8 bg-gray-200 dark:bg-zinc-800 rounded-lg w-full mt-4" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!isSearching && !hasSearched && (
                <div className="text-center py-16 px-4">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
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
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-base font-bold text-gray-800 dark:text-zinc-200">
                    Mulai Pencarian Buku Anda
                  </h3>
                </div>
              )}

              {!isSearching && hasSearched && books.length === 0 && !searchError && (
                <div className="text-center py-16 px-4 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl max-w-xl mx-auto shadow-xs">
                  <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-400 flex items-center justify-center">
                    <svg
                      className="w-7 h-7"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">
                    Buku Tidak Ditemukan
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-zinc-400 max-w-sm mx-auto mt-1">
                    Tidak ditemukan buku dengan kata kunci &quot;{searchQuery}&quot;. Silakan coba dengan kata kunci lain.
                  </p>
                </div>
              )}

              {!isSearching && books.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {books.map((book) => (
                    <BookCard
                      key={book.id}
                      book={book}
                      onToggleWishlist={() => handleToggleWishlist(book)}
                      isWishlisted={isBookWishlisted(book.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <WishlistView
            wishlist={wishlist}
            isLoading={isWishlistLoading}
            onRemoveFromWishlist={handleToggleWishlist}
            onSwitchToSearch={() => setActiveTab('search')}
          />
        )}
      </main>

      <footer className="mt-auto border-t border-gray-200 dark:border-zinc-800 py-6 text-center text-xs text-gray-500 dark:text-zinc-500">
        <p>Aplikasi Pencarian Buku</p>
      </footer>
    </div>
  );
}
