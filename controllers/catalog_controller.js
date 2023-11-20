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
    let rows = await partRepo.getAll()
    for (row of rows) {
        row.quantity = (await inventoryRepo.getById(row.number)).quantity
    }
    res.render('catalog.ejs', { rows: rows })
})