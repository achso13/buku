import { NextRequest, NextResponse } from 'next/server';

export interface BookItem {
  id: string;
  title: string;
  authors: string[];
  thumbnail: string;
  averageRating: number;
  ratingsCount: number;
  description: string;
  previewLink: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.trim() || '';

    if (!query) {
      return NextResponse.json({ items: [], totalItems: 0 });
    }

    const googleBooksUrl = `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${process.env.BOOKS_API_KEY}`;

    let googleResponse: Response | null = null;
    try {
      googleResponse = await fetch(googleBooksUrl, {
        headers: {
          Accept: 'application/json',
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
        next: { revalidate: 60 },
      });
    } catch (fetchErr) {
      console.warn('Google Books fetch error:', fetchErr);
    }

    if (googleResponse && googleResponse.ok) {
      const data = await googleResponse.json();
      const rawItems = data.items || [];

      const items: BookItem[] = rawItems.map((item: any) => {
        const info = item.volumeInfo || {};

        let thumbnail =
          info.imageLinks?.thumbnail ||
          info.imageLinks?.smallThumbnail ||
          '';

        if (thumbnail.startsWith('http://')) {
          thumbnail = thumbnail.replace('http://', 'https://');
        }

        return {
          id: item.id || Math.random().toString(36).substring(2, 9),
          title: info.title || 'Tanpa Judul',
          authors:
            Array.isArray(info.authors) && info.authors.length > 0
              ? info.authors
              : ['Penulis Tidak Diketahui'],
          thumbnail,
          averageRating:
            typeof info.averageRating === 'number'
              ? Math.min(5, Math.max(0, info.averageRating))
              : 0,
          ratingsCount:
            typeof info.ratingsCount === 'number' ? info.ratingsCount : 0,
          description: info.description || '',
          previewLink: info.previewLink || info.infoLink || '',
        };
      });

      return NextResponse.json({
        items,
        totalItems: data.totalItems || items.length,
        source: 'google_books',
      });
    }

    return NextResponse.json(
      { items: [], totalItems: 0, error: 'Gagal mengambil data buku' },
      { status: 500 }
    );
  } catch (error) {
    console.error('API Error in /api/buku:', error);
    return NextResponse.json(
      {
        items: [],
        totalItems: 0,
        error: (error as Error).message || 'Terjadi kesalahan server',
      },
      { status: 500 }
    );
  }
}

