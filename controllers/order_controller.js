const asyncHandler = require('express-async-handler')
const AppDAO = require('../models/app_dao')
const LegacyDAO = require('../models/legacy_dao')
const PartRepository = require('../models/part_repository')
const InventoryRepository = require('../models/inventory_repository')
const OrderRepository = require('../models/order_repository')


const dao = new AppDAO('./db/database.db')
const legacyDao = new LegacyDAO()
const partRepo = new PartRepository(legacyDao)
const inventoryRepo = new InventoryRepository(dao)
const orderRepo = new OrderRepository(dao)

exports.index = asyncHandler(async (req, res, next) => {
    let orders = await orderRepo.getAll()
    for (order of orders) {
        order.quantity = (await orderRepo.getByDate(order.number)).quantity
    }
    res.render('orders.ejs', { all: orders })
})

exports.displayOrdersSearchResults = asyncHandler(async (req, res, next) => {
    const dateRange = req.body.dateRange
    const orders = await orderRepo.getByDate(dateRange)
    
    res.render('orders.ejs', {all: orders})
})

exports.displayOrdersStatus = asyncHandler(async (req, res, next) => {
    const status = req.body.status
    const orders = await orderRepo.getByStatus(status)

    res.render('orders.ejs', {all: orders})
})