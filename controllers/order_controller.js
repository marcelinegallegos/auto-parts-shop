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
    const query = req.body.query
    const searchBy = req.body.searchType
    let orders

    if(searchBy) {
        orders = await orderRepo.getByDate(query)
    }
    for (order of orders) {
        order.date = (await orderRepo.getByDate(order.number)).date
    }
    res.render('orders.ejs', {all: orders})
})

exports.displayOrdersStatus = asyncHandler(async (req, res, next) => {
    const query = req.body.query
    const searchBy = req.body.searchType
    let orders

    if(searchBy) {
        orders = await orderRepo.getByStatus(query)
    }
    for (order of orders) {
        order.status = (await orderRepo.getByStatus(order.status)).status
    }
    res.render('orders.ejs', {all: orders})
})