import mongoose from 'mongoose';

// Sub-schema for reviews
const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  { _id: false } // Optional: avoids creating an _id for each review
);

// Sub-schema for specifications
const specificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

// Sub-schema for images
const imageSchema = new mongoose.Schema(
  {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

// Sub-schema for brand
const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    logo: imageSchema,
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter product name"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please enter product description"],
    },
    highlights: [
      {
        type: String,
        required: true,
      },
    ],
    specifications: [specificationSchema],
    price: {
      type: Number,
      required: [true, "Please enter product price"],
    },
    cuttedPrice: {
      type: Number,
      required: [true, "Please enter cutted price"],
    },
    images: [imageSchema],
    brand: brandSchema,
    category: {
      type: String,
      required: [true, "Please enter product category"],
    },
    stock: {
      type: Number,
      required: [true, "Please enter product stock"],
      max: [9999, "Stock cannot exceed limit"], // modern validation
      default: 1,
    },
    warranty: {
      type: Number,
      default: 1,
    },
    ratings: {
      type: Number,
      default: 0,
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
    reviews: [reviewSchema],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt & updatedAt
  }
);

export default mongoose.model("Product", productSchema);
