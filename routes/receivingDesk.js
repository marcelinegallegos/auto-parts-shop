const express = require('express')
const router = express.Router()

const receivingController = require ('../controllers/receiving_desk_controller')

router.get('/', receivingController.index)

module.exports = router