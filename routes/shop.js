const express = require('express')
const router = express.Router()

const catalogController = require ('../controllers/catalog_controller')
const cartController = require ('../controllers/cart_controller')
const checkoutController = require('../controllers/checkout_controller')

router.get('/', catalogController.index)

router.post('/addToCart', cartController.addToCart)

router.get('/shoppingCart', cartController.getCart)

router.get('/checkout', checkoutController.checkout)

module.exports = router