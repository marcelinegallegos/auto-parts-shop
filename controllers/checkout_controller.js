const asyncHandler = require('express-async-handler')
const AppDAO = require('../models/app_dao')
const LegacyDAO = require('../models/legacy_dao')
const PartRepository = require('../models/part_repository')
const InventoryRepository = require('../models/inventory_repository')
const OrderRepository = require('../models/order_repository')
const ShippingRepository = require('../models/order_repository')
const Cart = require('../models/cart')

const dao = new AppDAO('./db/database.db')
const legacyDao = new LegacyDAO()
const partRepo = new PartRepository(legacyDao)
const inventoryRepo = new InventoryRepository(dao)
const orderRepo = new OrderRepository(dao)
const shippingRepo = new ShippingRepository(dao)

//render checkout page
exports.checkout = (req, res, next) => {
    res.render('checkout.ejs')
}

//insert into order_respository
exports.getCustomerInfo = asyncHandler(async (req, res, next) => {
    const firstName = req.body.firstName
    const lastName = req.body.lastName
    const email = req.body.email
    const address = req.body.address
    const city = req.body.city
    const state = req.body.state
    const zip = req.body.zip
    const country = req.body.country

    //call getCart() for weight and amount
    let cart = Cart.getCart()
    const amount = cart.totalPrice
    const weight = cart.totalWeight
    console.log(cart)

    //insert cust info into database
    orderRepo.create(firstName, lastName, email, amount, weight, address, city, state, zip, country)
   // console.log(await orderRepo.getAll())

   // res.render('confirmation.ejs')  
});

//order_items_repository

//get shipping charges