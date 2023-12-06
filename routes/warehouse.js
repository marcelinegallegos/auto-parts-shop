const express = require('express')
const router = express.Router()

const workstationController = require('../controllers/workstation_controller')
const receivingDeskContoller = require('../controllers/receiving_desk_controller')

router.get('/workstation', workstationController.index)

router.post('/api/orders/update-order-status', workstationController.updateOrderStatus)

router.get('/receiving-desk', receivingDeskContoller.index)

router.post('/api/inventory/search', receivingDeskContoller.getInventory)

router.post('/api/inventory/update-quantity', receivingDeskContoller.updateQuantityOnHand)

// router.post('/api/inventory/search', receivingDeskContoller.getSearchResults)

module.exports = router
