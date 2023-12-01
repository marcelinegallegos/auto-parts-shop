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

exports.index = asyncHandler(async (req, res, next) => {
    res.render('catalog.ejs')
})

exports.getParts = asyncHandler(async (req, res, next) => {
    let parts = await partRepo.getAll()
    for (part of parts) {
        part.quantity = (await inventoryRepo.getById(part.number)).quantity
        part.inCartQuantity = Cart.getInCartQuantity(part.number)
    }
    res.json(parts)
})

exports.getCart = asyncHandler(async (req, res, next) => {
    const cart = Cart.getCart()
    res.json(cart)
})
