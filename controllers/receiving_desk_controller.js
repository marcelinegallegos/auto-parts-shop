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
    let parts = await partRepo.getAll()
    for (part of parts) {
        part.quantity = (await inventoryRepo.getById(part.number)).quantity
    }
    res.render('receivingDesk.ejs', { all: parts })
})

exports.updateQuantityOnHand = asyncHandler(async (req, res, next) => {
    const partNumber = req.body.partId
    const quantity = parseInt(req.body.quantityOnHand, 10)
    const action = req.body.action

    if (action === 'increment') {
        inventoryRepo.update(partNumber, quantity + 1)
    } else if (action === 'decrement') {
        if (quantity <= 0)
        {
            inventoryRepo.update(partNumber, 0)
        }
        else
        {
            inventoryRepo.update(partNumber, quantity - 1)
        }
    }

    res.redirect('/receivingDesk')
})

exports.displaySearchResults = asyncHandler(async (req, res, next) => {
    const query = req.body.query
    const searchBy = req.body.searchType
    let parts

    if(searchBy === 'Description') {
        parts = await partRepo.getByDescriptionLike(query)
    } else if(searchBy === 'Part ID') {
        parts = await partRepo.getById(query)
    }
    for (part of parts) {
        part.quantity = (await inventoryRepo.getById(part.number)).quantity
    }
    res.render('receivingDesk.ejs', {all: parts})
})