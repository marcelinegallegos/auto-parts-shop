const asyncHandler = require('express-async-handler')
const AppDAO = require('../models/app_dao')
const LegacyDAO = require('../models/legacy_dao')
const OrderRepository = require('../models/order_repository')
const OrderItemsRepository = require('../models/order_items_repository')
const PartRepository = require('../models/part_repository')

const dao = new AppDAO('./db/database.db')
const legacyDao = new LegacyDAO()
const orderRepo = new OrderRepository(dao)
const orderItemsRepo = new OrderItemsRepository(dao)
const partRepo = new PartRepository(legacyDao)

exports.index = asyncHandler(async (req, res, next) => {
    const orderId = req.query.orderId
    const cc = req.query.cc
    const exp = req.query.exp
    const lastFour = cc.slice(-4)

    try {
        let items = await orderItemsRepo.getById(orderId)
        let order = await orderRepo.getById(orderId)

        for (item of items) {
            item.description = ((await partRepo.getById(item.partNumber))[0].description)
            item.price = ((await partRepo.getById(item.partNumber))[0].price)
        }
        res.render('confirmation.ejs', { all: items, order: order, lastFour: lastFour})
    } catch {
        console.error('Error viewing invoice:', error)
    }
})