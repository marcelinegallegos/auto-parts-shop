const express = require('express')
const router = express.Router()

const workstationController = require('../controllers/workstation_controller')

router.get('/workstation', workstationController.index)

router.post('/api/orders/update-order-status', workstationController.updateOrderStatus)

module.exports = router
