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
    let rows = await partRepo.getAll()
    for (row of rows) {
        row.quantity = (await inventoryRepo.getById(row.number)).quantity
    }
    res.render('catalog.ejs', { rows: rows })
})

exports.addToCart = asyncHandler(async (req, res, next) => {
    const addedPart = await partRepo.getById(req.body.productId);

    if (addedPart) {
        Cart.save(addedPart);
        console.log(Cart.getCart());
        res.end('saved successfully');
    } else {
        res.status(404).send('Part not found');
    }
});

