const router = require('express').Router();
const { getOrders } = require('../controllers/orderController');
const { authenticate } = require('../middleware/verifyJWT');

router.get('/', authenticate, getOrders);

module.exports = router;