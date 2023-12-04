const nodemailer = require("nodemailer")
const asyncHandler = require('express-async-handler')
const AppDAO = require('../models/app_dao')
const OrderRepository = require('../models/order_repository')
const Mail = require('../scripts/mail')

const dao = new AppDAO('./db/database.db')
const orderRepo = new OrderRepository(dao)
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
exports.updateOrderStatus = (req, res, next) => {
    const orderId = req.body.orderId;
    const currentStatus = req.body.currentStatus;
    const email = req.body.email

    orderRepo.update('shipped', orderId)
        .then(() => {
            res.json({ message: 'Order status updated successfully' });
            mail.sendShippingEmail(email)
        })
        .catch(error => {
            console.error('Error updating order status:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
};
