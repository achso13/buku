import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IWishlist extends Document {
  bookId: string;
  title: string;
  authors: string[];
  thumbnail: string;
  averageRating: number;
  ratingsCount: number;
  description: string;
  previewLink: string;
  createdAt: Date;
}

const WishlistSchema = new Schema<IWishlist>(
  {
    bookId: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    authors: { type: [String], default: [] },
    thumbnail: { type: String, default: '' },
    averageRating: { type: Number, default: 0 },
    ratingsCount: { type: Number, default: 0 },
    description: { type: String, default: '' },
    previewLink: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: false,
  }
);

const Wishlist: Model<IWishlist> =
  (mongoose.models.Wishlist as Model<IWishlist>) ||
  mongoose.model<IWishlist>('Wishlist', WishlistSchema);

export default Wishlist;

