const asyncHandler = require('express-async-handler')
const processCredit = require('../scripts/credit')
const AppDAO = require('../models/app_dao')
const LegacyDAO = require('../models/legacy_dao')
const OrderRepository = require('../models/order_repository')
const OrderItemsRepository = require('../models/order_items_repository')
const PartRepository = require('../models/part_repository')
const Cart = require('../scripts/cart')

const dao = new AppDAO('./db/database.db')
const legacyDao = new LegacyDAO()
const orderRepo = new OrderRepository(dao)
const orderItemsRepo = new OrderItemsRepository(dao)
const partRepo = new PartRepository(legacyDao)




//render checkout page

exports.checkout = (req, res, next) => {
    res.render('checkout.ejs')
}

//insert into order_respository
exports.addOrder = asyncHandler(async (req, res, next) => {
    const firstName = req.body.firstName
    const lastName = req.body.lastName
    const email = req.body.email
    const address = req.body.address
    const city = req.body.city
    const state = req.body.state
    const zip = req.body.zip
    const country = req.body.country
    const cc = req.body.cc
    const exp = req.body.exp

    //call getCart() for weight and amount
    let cart = await Cart.getCart()
    const amount = cart.total.toFixed(2)
    const weight = cart.totalWeight

    const data = await processCredit(cc, `${firstName} ${lastName}`, exp, amount)
    if (data.authorization) {
        const order = await orderRepo.create(firstName, lastName, email, amount, weight, address, city, state, zip, country)

        console.log('Order ID:', order)

        //add order to order_items repository
        for (part of cart.parts) {
            await orderItemsRepo.create(order.id, part.number, part.quantity)
        }
        res.status(200).json({'url' : `/shop/confirmation/?orderId=${order.id}`})
    } else {
        res.status(400).json(data.errors)
    }
})