const asyncHandler = require('express-async-handler')
const AppDAO = require('../models/app_dao')
const LegacyDAO = require('../models/legacy_dao')
const PartRepository = require('../models/part_repository')
const InventoryRepository = require('../models/inventory_repository')


const dao = new AppDAO('./db/database.db')
const legacyDao = new LegacyDAO()
const partRepo = new PartRepository(legacyDao)
const inventoryRepo = new InventoryRepository(dao)

exports.index  = asyncHandler(async (req, res, next) => {
    let parts = await inventoryRepo.getAll()
    for (part of parts) {
        part.description = (await partRepo.getById(part.partNumber)).description
    }
    res.render('receivingDesk.ejs', { all: parts })
})