import Product from '../models/productModel.js';
import asyncErrorHandler from '../middlewares/asyncErrorHandler.js';
import SearchFeatures from '../utils/searchFeatures.js';
import ErrorHandler from '../utils/errorHandler.js';
import cloudinary from 'cloudinary';

// Get All Products
export const getAllProducts = asyncErrorHandler(async (req, res, next) => {
    const resultPerPage = 12;

    const productsCount = await Product.countDocuments();

    const searchFeature = new SearchFeatures(Product.find(), req.query)
        .search()
        .filter();

    let products = await searchFeature.query;
    let filteredProductsCount = products.length;

    searchFeature.pagination(resultPerPage);
    products = await searchFeature.query.clone();

    res.status(200).json({
        success: true,
        products,
        productsCount,
        resultPerPage,
        filteredProductsCount,
    });
});

// Get All Products for Slider
export const getProducts = asyncErrorHandler(async (req, res, next) => {
    const products = await Product.find();
    res.status(200).json({ success: true, products });
});

// Get Product Details
export const getProductDetails = asyncErrorHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) return next(new ErrorHandler("Product Not Found", 404));

    res.status(200).json({ success: true, product });
});

// Admin: Get All Products
export const getAdminProducts = asyncErrorHandler(async (req, res, next) => {
    const products = await Product.find();
    res.status(200).json({ success: true, products });
});

// Admin: Create Product
export const createProduct = asyncErrorHandler(async (req, res, next) => {
    let images = typeof req.body.images === "string" ? [req.body.images] : req.body.images;

    const imagesLink = [];
    for (const img of images) {
        const result = await cloudinary.uploader.upload(img, { folder: "products" });
        imagesLink.push({ public_id: result.public_id, url: result.secure_url });
    }

    const brandResult = await cloudinary.uploader.upload(req.body.logo, { folder: "brands" });
    const brandLogo = { public_id: brandResult.public_id, url: brandResult.secure_url };

    req.body.brand = { name: req.body.brandname, logo: brandLogo };
    req.body.images = imagesLink;
    req.body.user = req.user.id;

    const specs = req.body.specifications.map(s => JSON.parse(s));
    req.body.specifications = specs;

    const product = await Product.create(req.body);

    res.status(201).json({ success: true, product });
});

// Admin: Update Product
export const updateProduct = asyncErrorHandler(async (req, res, next) => {
    let product = await Product.findById(req.params.id);
    if (!product) return next(new ErrorHandler("Product Not Found", 404));

    // Update images if provided
    if (req.body.images) {
        const images = typeof req.body.images === "string" ? [req.body.images] : req.body.images;
        for (const img of product.images) await cloudinary.uploader.destroy(img.public_id);

        const imagesLink = [];
        for (const img of images) {
            const result = await cloudinary.uploader.upload(img, { folder: "products" });
            imagesLink.push({ public_id: result.public_id, url: result.secure_url });
        }
        req.body.images = imagesLink;
    }

    // Update brand logo
    if (req.body.logo?.length > 0) {
        await cloudinary.uploader.destroy(product.brand.logo.public_id);
        const result = await cloudinary.uploader.upload(req.body.logo, { folder: "brands" });
        req.body.brand = { name: req.body.brandname, logo: { public_id: result.public_id, url: result.secure_url } };
    }

    req.body.specifications = req.body.specifications.map(s => JSON.parse(s));
    req.body.user = req.user.id;

    product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    res.status(201).json({ success: true, product });
});

// Admin: Delete Product
export const deleteProduct = asyncErrorHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) return next(new ErrorHandler("Product Not Found", 404));

    for (const img of product.images) await cloudinary.uploader.destroy(img.public_id);
    await product.remove();

    res.status(201).json({ success: true });
});

// Create or Update Review
export const createProductReview = asyncErrorHandler(async (req, res, next) => {
    const { rating, comment, productId } = req.body;
    const product = await Product.findById(productId);
    if (!product) return next(new ErrorHandler("Product Not Found", 404));

    const review = { user: req.user._id, name: req.user.name, rating: Number(rating), comment };
    const existingReview = product.reviews.find(r => r.user.toString() === req.user._id.toString());

    if (existingReview) {
        product.reviews.forEach(r => { if (r.user.toString() === req.user._id.toString()) { r.rating = rating; r.comment = comment; } });
    } else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }

    product.ratings = product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;

    await product.save({ validateBeforeSave: false });
    res.status(200).json({ success: true });
});

// Get Reviews
export const getProductReviews = asyncErrorHandler(async (req, res, next) => {
    const product = await Product.findById(req.query.id);
    if (!product) return next(new ErrorHandler("Product Not Found", 404));

    res.status(200).json({ success: true, reviews: product.reviews });
});

// Delete Review
export const deleteReview = asyncErrorHandler(async (req, res, next) => {
    const product = await Product.findById(req.query.productId);
    if (!product) return next(new ErrorHandler("Product Not Found", 404));

    const reviews = product.reviews.filter(r => r._id.toString() !== req.query.id.toString());
    const ratings = reviews.length === 0 ? 0 : reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
    const numOfReviews = reviews.length;

    await Product.findByIdAndUpdate(req.query.productId, { reviews, ratings, numOfReviews }, { new: true, runValidators: true });
    res.status(200).json({ success: true });
});
