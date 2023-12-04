const asyncHandler = require('express-async-handler')
const AppDAO = require('../models/app_dao')
const OrderRepository = require('../models/order_repository')
const Cart = require('../scripts/cart')

const dao = new AppDAO('./db/database.db')
const orderRepo = new OrderRepository(dao)

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

    //call getCart() for weight and amount
    let cart = await Cart.getCart()
    const amount = cart.totalPrice
    const weight = cart.totalWeight

    try {
        const orderId = await orderRepo.create(firstName, lastName, email, amount, weight, address, city, state, zip, country)
        console.log('Order ID:', orderId)
        res.redirect(`/shop/confirmation/?orderId=${orderId.id}`)
    } catch (error) {
        console.error('Error during insertion:', error)
    }
        
   // res.json({ message: 'Created order ID' }) 
});

//order_items_repository

//get shipping charges