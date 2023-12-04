const express = require('express')
const router = express.Router()

const catalogController = require ('../controllers/catalog_controller')
const cartController = require ('../controllers/cart_controller')
const checkoutController = require('../controllers/checkout_controller')

router.get('/', catalogController.index)

router.get('/api/parts', catalogController.getParts)

router.get('/api/cart', cartController.getCart)

router.post('/api/cart/add', cartController.addToCart)

router.post('/api/cart/update-quantity', cartController.updateQuantityInCart)

router.post('/api/cart/remove', cartController.removeFromCart)

router.post('/api/orders/add', checkoutController.addOrder)

router.get('/cart', cartController.index)

router.get('/checkout', checkoutController.checkout)

//router.post('/getCustomerInfo', checkoutController.getCustomerInfo)

module.exports = router