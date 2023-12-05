const nodemailer = require("nodemailer")
const asyncHandler = require('express-async-handler')
const AppDAO = require('../models/app_dao')
const OrderRepository = require('../models/order_repository')
const OrderItemsRepository = require('../models/order_items_repository')
const Mail = require('../scripts/mail')
const LegacyDAO = require("../models/legacy_dao")
const PartRepository = require("../models/part_repository")

const dao = new AppDAO('./db/database.db')
const legacyDao = new LegacyDAO()
const orderRepo = new OrderRepository(dao)
const orderItemsRepo = new OrderItemsRepository(dao)
const partRepo =  new PartRepository(legacyDao)
const mail = new Mail()

exports.index = (req, res, next) => {
    orderRepo.getAll()
    .then((list) => {
        res.render('workstation.ejs', {
            all: list
        });
    })
    .catch((error) => {
        console.error('Error fetching orders:', error);
        res.status(500).send('Internal Server Error');
    });
};

// Route to update order status
exports.updateOrderStatus = asyncHandler(async (req, res, next) => {
    const orderId = req.body.orderId;
    const currentStatus = req.body.currentStatus;
    const emailAddr = req.body.email

    try {
        await orderRepo.update('shipped', orderId)
    } catch (error) {
        console.error('Error updating order status:', error)
        res.status(500).json({ error: 'Internal Server Error' })
    }

    const order = await orderRepo.getById(orderId)
    let items = await orderItemsRepo.getById(orderId)
    for (item of items) {
        part = (await partRepo.getById(item.partNumber))[0]
        item.description = part.description
        item.totalPrice = (part.price * item.quantity).toFixed(2)
    }
    //mail.sendShippingEmail(emailAddr, order, items)
    res.json({ message: 'Order status updated successfully' })
})

