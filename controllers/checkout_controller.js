const asyncHandler = require('express-async-handler')
const processCredit = require('../scripts/credit')
const AppDAO = require('../models/app_dao')
const LegacyDAO = require('../models/legacy_dao')
const OrderRepository = require('../models/order_repository')
const OrderItemsRepository = require('../models/order_items_repository')
const PartRepository = require('../models/part_repository')
const Cart = require('../scripts/cart')
const Mail = require('../scripts/mail')
const InventoryRepository = require('../models/inventory_repository')

const dao = new AppDAO('./db/database.db')
const legacyDao = new LegacyDAO()
const orderRepo = new OrderRepository(dao)
const orderItemsRepo = new OrderItemsRepository(dao)
const partRepo = new PartRepository(legacyDao)
const mail = new Mail()
const inventoryRepo = new InventoryRepository(dao)




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
    const lastFour = cc.slice(-4)

    //call getCart() for weight, amount, and shipping
    let cart = await Cart.getCart()
    const amount = cart.total.toFixed(2)
    const weight = cart.totalWeight
    const shipping = cart.shipping

    const data = await processCredit(cc, `${firstName} ${lastName}`, exp, amount)
    if (data.authorization) {
        let order = await orderRepo.create(firstName, lastName, email, amount, weight, address, city, state, zip, country)
        order.amount = amount

        //add order to order_items repository
        for (part of cart.parts) {
            await orderItemsRepo.create(order.id, part.number, part.quantity)
            await inventoryRepo.update(part.number, (await inventoryRepo.getById(part.number)).quantity - part.quantity)
        }

        //clear cart for next order
        Cart.empty()

        let items = await orderItemsRepo.getById(order.id)
        for (item of items) {
            part = (await partRepo.getById(item.partNumber))[0]
            item.description = part.description
            item.totalPrice = (part.price * item.quantity).toFixed(2)
        }
        //mail.sendConfirmationEmail(email, order, items)

        res.status(200).json({'url' : `/shop/confirmation/?orderId=${order.id}&lastFour=${lastFour}&exp=${exp}&shipping=${shipping}`})
    } else {
        res.status(400).json(data.errors)
    }
})
