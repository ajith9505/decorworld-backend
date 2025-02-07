const router = require('express').Router();
const { orderPayment, validateOrder } = require('../controllers/paymentController')

router.post('/', orderPayment);
router.post('/validate', validateOrder)

module.exports = router;