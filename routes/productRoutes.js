const { getProducts, postProduct } = require('../controllers/productController')
// const verifyJWT = require('../middleware/verifyJWT')

const router = require('express').Router()

// router.use(verifyJWT)

router.route('/')
    .get(getProducts)
    .post(postProduct)


module.exports = router