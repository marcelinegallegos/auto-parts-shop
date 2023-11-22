const express = require('express')
const router = express.Router()

const catalogController = require ('../controllers/catalog_controller')

router.get('/', catalogController.index)

router.post('/add_to_cart', catalogController.addToCart)

module.exports = router