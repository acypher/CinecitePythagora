import mongoose, { Document, Schema } from 'mongoose';

export interface ISearchCache extends Document {
  query: string;
  normalizedQuery: string;
  title: string;
  year?: string;
  posterUrl?: string;
  ratings: Array<{
    source: string;
    criticsRating?: string;
    audienceRating?: string;
  }>;
  plot?: string;
  cast?: string[];
  reviewerSummary?: string;
  searchCount: number;
  lastSearchedAt: Date;
  createdAt: Date;
  expiresAt: Date;
}

const schema = new Schema<ISearchCache>({
  query: {
    type: String,
    required: true,
  },
  normalizedQuery: {
    type: String,
    required: true,
    index: true,
    unique: true,
    lowercase: true,
  },
  title: {
    type: String,
    required: true,
  },
  year: {
    type: String,
    required: false,
  },
  posterUrl: {
    type: String,
    required: false,
  },
  ratings: [{
    source: {
      type: String,
      required: true,
    },
    criticsRating: {
      type: String,
      required: false,
    },
    audienceRating: {
      type: String,
      required: false,
    },
  }],
  plot: {
    type: String,
    required: false,
  },
  cast: [{
    type: String,
  }],
  reviewerSummary: {
    type: String,
    required: false,
  },
  searchCount: {
    type: Number,
    default: 1,
  },
  lastSearchedAt: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true,
  },
  expiresAt: {
    type: Date,
    required: true,
    index: true,
  },
}, {
  versionKey: false,
});

// TTL index for automatic cache expiration
schema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const SearchCache = mongoose.model<ISearchCache>('SearchCache', schema);

export default SearchCache;
