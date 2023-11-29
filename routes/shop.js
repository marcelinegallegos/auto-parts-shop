const express = require('express')
const router = express.Router()

const catalogController = require ('../controllers/catalog_controller')
const cartController = require ('../controllers/cart_controller')

router.get('/', catalogController.index)

router.post('/addToCart', cartController.addToCart)

router.get('/shoppingCart', cartController.getCart)

module.exports = router