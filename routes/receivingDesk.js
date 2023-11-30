const express = require('express')
const router = express.Router()

const receivingController = require ('../controllers/receiving_desk_controller')

router.get('/', receivingController.index)
router.post('/updateQuantityOnHand', receivingController.updateQuantityOnHand)
router.post('/displaySearchResults', receivingController.displaySearchResults)

module.exports = router