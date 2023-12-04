const asyncHandler = require('express-async-handler')
const AppDAO = require('../models/app_dao')
const OrderRepository = require('../models/order_repository')

const dao = new AppDAO('./db/database.db')
const orderRepo = new OrderRepository(dao)

exports.index = (req, res, next) => {
    const orderId = req.query.orderId
    res.render('confirmation.ejs')
}