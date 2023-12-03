const asyncHandler = require('express-async-handler')
const AppDAO = require('../models/app_dao')
const LegacyDAO = require('../models/legacy_dao')
const PartRepository = require('../models/part_repository')
const InventoryRepository = require('../models/inventory_repository')
const ShippingRepository = require('../models/shipping_repository')
const Cart = require('../models/cart')

const dao = new AppDAO('./db/database.db')
const legacyDao = new LegacyDAO()
const partRepo = new PartRepository(legacyDao)
const inventoryRepo = new InventoryRepository(dao)
const shippingRepo = new ShippingRepository(dao)

exports.index = asyncHandler(async (req, res, next) => {
    res.render('cart.ejs')
})

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

exports.updateQuantityInCart = asyncHandler(async (req, res, next) => {
    try {
        Cart.setQuantity(req.body.partNumber, req.body.newQuantity)
    } catch (error) {
        console.error('Error:', error)
        res.status(500).json({ message: 'Error updatings cart' })
    }
    res.json({ message: 'Updated cart' })
})

exports.getCart = asyncHandler(async (req, res, next) => {
    let cart = Cart.getCart()
    for (part of cart.parts) {
        part.quantityInStock = (await inventoryRepo.getById(part.number)).quantity
    }

    shippingBracket = await shippingRepo.getByWeight(cart.totalWeight)
    
    if(shippingBracket) {
        cart.shipping = shippingBracket.cost
    } else {
        minWeightBracket = await shippingRepo.getMinWeightBracket()
        maxWeightBracket = await shippingRepo.getMaxWeightBracket()

        if (cart.totalWeight < minWeightBracket.minWeight) {
            cart.shipping = 0
        } else {
            cart.shipping = maxWeightBracket.cost * 2
        }
    }

    cart.total = cart.subtotal + cart.shipping

    res.json(cart)    
})

exports.removeFromCart = asyncHandler(async (req, res, next) => {
    try {
        Cart.remove(req.body.partNumber)
    } catch (error) {
        console.error('Error:', error)
        res.status(500).json({ message: 'Error removing part from cart' })
    }
    res.json({ message: 'Part removed from cart successfully' })
})
