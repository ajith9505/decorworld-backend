const router = require('express').Router();
const orderPayment = require('../controllers/paymentController')

router.post('/', orderPayment);

module.exports = router;