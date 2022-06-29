const Product = require("../models/product");

const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const APIFeatures = require("../utils/apiFeatures");
const cloudinary=require('cloudinary')
const { query } = require("express");

exports.newProduct = catchAsyncErrors(async (req, res, next) => {

  let images = []
  if (typeof req.body.images === 'string') {
      images.push(req.body.images)
  } else {
      images = req.body.images
  }

  let imagesLinks = [];

  for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
          folder: 'products'
      });

      imagesLinks.push({
          public_id: result.public_id,
          url: result.secure_url
      })
  }

  req.body.images = imagesLinks
  req.body.user = req.user.id;

  const product = await Product.create(req.body);

  res.status(201).json({
      success: true,
      product
  })
})



exports.getProducts = catchAsyncErrors(async (req, res, next) => {

  const resPerPage = 4;
  const productsCount = await Product.countDocuments();

  const apiFeatures = new APIFeatures(Product.find(), req.query)
      .search()
      .filter()

  let products = await apiFeatures.query;
  let filteredProductsCount = products.length;

  apiFeatures.pagination(resPerPage)
  products = await apiFeatures.query;
  

 
  res.status(200).json({
      success: true,
      productsCount,
      resPerPage,
      filteredProductsCount,
      products
  })

})







exports.getAdminProducts = catchAsyncErrors(async (req, res, next) => {
  const resPerPage = 4;
  const products = await Product.find();

  res.status(200).json({
    success: true,
    products,
  });
});
exports.getSingleProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  res.status(200).json({
    success: true,
    product,
  });
});

exports.deleteProduct = catchAsyncErrors(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }
  for(let i=0; i<product.images.length; i++){
    const result=await cloudinary.v2.uploader.destroy(product.images[i].public_id)
  }
  await product.remove();

  res.status(200).json({
    success: true,
    message: "Product is deleted.",
  });
});

exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
  const { ratings, comment, productId } = req.body;

  const reviews = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(ratings),
    comment,
  };

  

  const product = await Product.findById(productId);
  const isReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );
  if (isReviewed) {
    product.reviews.forEach((reviews) => {
      if (reviews.user.toString() === req.user._id.toString()) {
        reviews.comment = comment;
        reviews.rating = ratings;
      }
    });
  } else {
    product.reviews.push(reviews);

    product.numOfReviews = product.reviews.length;
  }
  product.ratings =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.reviews.length;

    console.log("rrrrrrrrrrrrrrrrrrrrr",product.ratings);

  await product.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
  });
});

exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  let images = []
  if (typeof req.body.images === 'string') {
      images.push(req.body.images)
  } else {
      images = req.body.images
  }
  if(images!==undefined){
    for(i=0; i<product.images.length; i++){
      const result=await cloudinary.v2.uploader.destroy(product.images[i].public_id)
    }
    let imagesLinks = [];

  for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
          folder: 'products'
      });

      imagesLinks.push({
          public_id: result.public_id,
          url: result.secure_url
      })
  }

  req.body.images = imagesLinks
  }
  

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    product,
  });
});
exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
  
  const product = await Product.findById(req.query.id);
  
  res.status(200).json({
    success: true,
    reviews: product.reviews,
   
  });
  
});
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);

  const reviews = product?.reviews?.filter(
    (review) => review.id.toString() !== req.query.id.toString()
  );

  const numOfReviews = reviews.length;
  const rating =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.reviews.length;

  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      rating,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );
  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});
