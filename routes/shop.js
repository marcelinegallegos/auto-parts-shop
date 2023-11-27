const express = require('express')
const router = express.Router()

const catalogController = require ('../controllers/catalog_controller')

router.get('/', catalogController.index)

router.post('/addToCart', catalogController.addToCart)

router.get('/shoppingCart', catalogController.getCart)

module.exports = router