const router = require('express').Router();
const { orderPayment, validateOrder } = require('../controllers/paymentController');
const { authenticate } = require('../middleware/verifyJWT');

router.post('/',authenticate, orderPayment);
router.post('/validate',authenticate, validateOrder);

module.exports = router;