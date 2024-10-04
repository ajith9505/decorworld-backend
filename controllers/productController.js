const expressAsyncHandler = require("express-async-handler");
const Product = require("../models/Products");

// @desc get all products
// @route GET /product
// @access public

const getAllProducts = expressAsyncHandler(async (req, res) => {
    try {
        const products = await Product.find({})
            .populate("category")
            .limit(12)
            .sort({ createAt: -1 });

        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server Error" });
    }
});

// @desc get product details
// @route GET /product
// @access public

const getProducts = expressAsyncHandler(async (req, res) => {
    try {
        const pageSize = 6;

        const keyword = req.query.keyword
            ? {
                name: {
                    $regex: req.query.keyword,
                    $options: "i",
                },
            }
            : {};

        const count = await Product.countDocuments({ ...keyword });
        const products = await Product.find({ ...keyword }).limit(pageSize);

        res.json({
            products,
            page: 1,
            pages: Math.ceil(count / pageSize),
            hasMore: false,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server Error" });
    }
});

// @desc get product by id
// @route GET /product/:id
// @access public

const getProductById = expressAsyncHandler(async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            return res.json(product);
        } else {
            res.status(404);
            throw new Error("Product not found");
        }
    } catch (error) {
        console.error(error);
        res.status(404).json({ error: "Product not found" });
    }
});

// @desc add new product
// @route POST /create-product
// @access private

const addProduct = expressAsyncHandler(async (req, res) => {
    try {
        const { name, description, price, category, quantity, brand } = req.data;

        // input validation
        switch (true) {
            case !name:
                return res.json({ error: "Name is required" });
            case !brand:
                return res.json({ error: "Brand is required" });
            case !description:
                return res.json({ error: "Description is required" });
            case !price:
                return res.json({ error: "Price is required" });
            case !category:
                return res.json({ error: "Category is required" });
            case !quantity:
                return res.json({ error: "Quantity is required" });
        }

        const product = new Product({ ...req.data });
        await product.save();
        res.json(product);
    } catch (error) {
        console.error(error);
        res.status(400).json(error.message);
    }
});

// @desc update existing product
// @route PUT /update-product
// @access private

const updateProductDetails = expressAsyncHandler(async (req, res) => {
    try {
        const { name, description, price, category, quantity, brand } = req.data;

        //input validation
        switch (true) {
            case !name:
                return res.json({ error: "Name is required" });
            case !brand:
                return res.json({ error: "Brand is required" });
            case !description:
                return res.json({ error: "Description is required" });
            case !price:
                return res.json({ error: "Price is required" });
            case !category:
                return res.json({ error: "Category is required" });
            case !quantity:
                return res.json({ error: "Quantity is required" });
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { ...req.data },
            { new: true }
        );

        await product.save();

        res.json(product);
    } catch (error) {
        console.error(error);
        res.status(400).json(error.message);
    }
});

// @desc remove existing product
// @route DELETE /delete-product
// @access private

const removeProduct = expressAsyncHandler(async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        res.json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});

// @desc update existing product
// @route PUT /update-product
// @access private

const filterProducts = expressAsyncHandler(async (req, res) => {
    try {
      const { checked, radio } = req.body;
  
      let args = {};
      if (checked.length > 0) args.category = checked;
      if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
  
      const products = await Product.find(args);
      res.json(products);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server Error" });
    }
  });

  module.exports = {
    getAllProducts,
    getProducts,
    getProductById,
    addProduct,
    updateProductDetails,
    removeProduct,
    filterProducts
  }