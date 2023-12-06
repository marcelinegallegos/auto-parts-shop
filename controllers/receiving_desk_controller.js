const asyncHandler = require('express-async-handler')
const AppDAO = require('../models/app_dao')
const LegacyDAO = require('../models/legacy_dao')
const PartRepository = require('../models/part_repository')
const InventoryRepository = require('../models/inventory_repository')


const dao = new AppDAO('./db/database.db')
const legacyDao = new LegacyDAO()
const partRepo = new PartRepository(legacyDao)
const inventoryRepo = new InventoryRepository(dao)

exports.index = asyncHandler(async (req, res, next) => {
    res.render('receiving_desk.ejs')
})

exports.getInventory = asyncHandler(async (req, res, next) => {
    const query = req.body.query
    const searchBy = req.body.searchBy
    console.log(query)
    console.log(searchBy)
    let parts

    if (searchBy == 'Description') {
        parts = await partRepo.getByDescriptionLike(query)
    } else if (searchBy === 'Part ID') {
        parts = await partRepo.getById(query)
        console.log('made it')
    }
    console.log(parts)
    for (part of parts) {
        part.quantity = (await inventoryRepo.getById(part.number)).quantity
    }

    res.json(parts)
})

exports.updateQuantityOnHand = asyncHandler(async (req, res, next) => {
    const partNumber = req.body.partNumber 
    const newQuantity = req.body.newQuantity

    try {
        await inventoryRepo.update(partNumber, newQuantity)
    } catch (error) {
        console.error('Error:', error)
        res.status(500).json({ message: 'Error updating inventory' })
    }
    res.json({ message: 'Updated inventory' })
})
