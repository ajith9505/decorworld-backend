const expressAsyncHandler = require("express-async-handler");
const Products = require("../models/Products");

const getProducts = expressAsyncHandler(async (req, res) => {
    const product = await Products.find().lean().exec()

    res.json({ product })
})

const postProduct = expressAsyncHandler(async (req, res) => {
    const { productName, price, stock, details, imgLink } = req.body

    if (!productName || !price || !stock || !details || !imgLink) return res.status(400).json({ message: 'All fields are required' })

    const product = new Products({
        productName: productName,
        price: price,
        stock: stock,
        details: details,
        imgLink: imgLink
    })

    await product.save()

    res.json('product uploaded')


})

module.exports = {
    getProducts,
    postProduct
}