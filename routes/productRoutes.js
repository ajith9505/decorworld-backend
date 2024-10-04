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

    router.route('/getproducts').get(getProducts)

router
  .route("/:id")
  .get(getProductById)
  .put(authenticate, authorizeAdmin, updateProductDetails)
  .delete(authenticate, authorizeAdmin, removeProduct);


module.exports = router