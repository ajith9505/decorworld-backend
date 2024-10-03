const { 
    getAllProducts,
    getProducts,
    getProductById,
    addProduct,
    updateProductDetails,
    removeProduct,
    filterProducts 
} = require('../controllers/productController')
const { authenticate, authorizeAdmin } = require('../middleware/verifyJWT')

const router = require('express').Router()

// router.use(verifyJWT)

router.route('/')
    .get(getAllProducts)
    .post(authenticate, authorizeAdmin, addProduct)

router.route('/getproduct:id').get(getProductById)
router.route('/getproducts').get(getProducts)
router.route('/')


module.exports = router