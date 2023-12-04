const asyncHandler = require('express-async-handler')
const processCredit = require('../scripts/credit')
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
    const cc = req.body.cc
    const exp = req.body.exp

    //call getCart() for weight and amount
    let cart = await Cart.getCart()
    const amount = cart.total
    const weight = cart.totalWeight

    try {
        const order = await orderRepo.create(firstName, lastName, email, amount, weight, address, city, state, zip, country)
        console.log('Order ID:', order)

        const data = await processCredit(cc, `${firstName} ${lastName}`, exp, amount)
        if (data.authorization)
        {
            orderRepo.update('authorized', order.id)
            res.redirect(`/shop/confirmation/?orderId=${order.id}`)
        } else {
            console.log(data.errors)
        }
    } catch (error) {
        console.error('Error during insertion:', error)
    }
        
   // res.json({ message: 'Created order ID' }) 
});

//order_items_repository

//get shipping charges