const asyncHandler = require('express-async-handler')
const AppDAO = require('../models/app_dao')
const LegacyDAO = require('../models/legacy_dao')
const PartRepository = require('../models/part_repository')
const InventoryRepository = require('../models/inventory_repository')
const Cart = require('../models/cart')

const dao = new AppDAO('./db/database.db')
const legacyDao = new LegacyDAO()
const partRepo = new PartRepository(legacyDao)
const inventoryRepo = new InventoryRepository(dao)

exports.addToCart = asyncHandler(async (req, res, next) => {
    const addedPart = await partRepo.getById(req.body.partNumber)

    if (addedPart) {
        Cart.save(addedPart)
        console.log(Cart.getCart())
        res.json({ message: 'Part added to cart successfully' })
    } else {
        console.error('Error:', error)
        res.status(500).json({ message: 'Error adding part to cart' })
    }
})

exports.setInCartQuantity = asyncHandler(async (req, res, next) => {
    const partNumber = req.body.partNumber
    const quantity = req.body.quantity

    Cart.setQuantity(partNumber, quantity)
    res.json({ message: 'Updated cart' })
})

exports.getCart = asyncHandler(async (req, res, next) => {
    let cart = Cart.getCart()
    for (part of cart.parts) {
        part.inStockQuantity = (await inventoryRepo.getById(part.number)).quantity
    }
    res.render('cart.ejs', { cart: cart })
})

exports.removeFromCart = asyncHandler(async (req, res, next) => {
    Cart.remove(req.body.productId)
    res.redirect('/ShoppingCart')
})

exports.updateQuantity = asyncHandler(async (req, res, next) => {
    const productId = req.body.productId
    const action = req.body.action

    if (action === 'increment') {
        Cart.increment(productId)
    } else if (action === 'decrement') {
        Cart.decrement(productId)
    }

    res.redirect('/ShoppingCart')
})