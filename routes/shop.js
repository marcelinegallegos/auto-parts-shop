const express = require('express')
const router = express.Router()

const catalogController = require ('../controllers/catalog_controller')

router.get('/', catalogController.index)

module.exports = router