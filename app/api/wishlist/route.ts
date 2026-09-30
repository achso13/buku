import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Wishlist from '@/models/Wishlist';

export async function GET() {
  try {
    await connectDB();
    const wishlistItems = await Wishlist.find({}).sort({ createdAt: -1 }).lean();

    return NextResponse.json({
      success: true,
      count: wishlistItems.length,
      data: wishlistItems,
    });
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    return NextResponse.json(
      {
        success: false,
        error: (error as Error).message || 'Gagal mengambil data wishlist',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const {
      bookId,
      title,
      authors,
      thumbnail,
      averageRating,
      ratingsCount,
      description,
      previewLink,
    } = body;

    if (!bookId || !title) {
      return NextResponse.json(
        { success: false, error: 'bookId dan title wajib diisi' },
        { status: 400 }
      );
    }

    const existing = await Wishlist.findOne({ bookId });
    if (existing) {
      return NextResponse.json({
        success: true,
        data: existing,
        message: 'Buku sudah ada di wishlist',
      });
    }

    const newItem = await Wishlist.create({
      bookId,
      title,
      authors: Array.isArray(authors) ? authors : [],
      thumbnail: thumbnail || '',
      averageRating: typeof averageRating === 'number' ? averageRating : 0,
      ratingsCount: typeof ratingsCount === 'number' ? ratingsCount : 0,
      description: description || '',
      previewLink: previewLink || '',
    });

    return NextResponse.json(
      {
        success: true,
        data: newItem,
        message: 'Buku berhasil ditambahkan ke wishlist',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    return NextResponse.json(
      {
        success: false,
        error: (error as Error).message || 'Gagal menambahkan ke wishlist',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    let bookId = searchParams.get('bookId');

    if (!bookId) {
      try {
        const body = await request.json();
        bookId = body.bookId;
      } catch {
        
      }
    }

    if (!bookId) {
      return NextResponse.json(
        { success: false, error: 'bookId wajib disertakan' },
        { status: 400 }
      );
    }

    const result = await Wishlist.findOneAndDelete({ bookId });

    if (!result) {
      return NextResponse.json(
        { success: false, error: 'Buku tidak ditemukan di wishlist' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Buku berhasil dihapus dari wishlist',
    });
  } catch (error) {
    console.error('Error deleting from wishlist:', error);
    return NextResponse.json(
      {
        success: false,
        error: (error as Error).message || 'Gagal menghapus dari wishlist',
      },
      { status: 500 }
    );
  }
}

