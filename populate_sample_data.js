const Promise = require('bluebird')
const AppDAO = require('./models/app_dao')
const LegacyDAO = require('./models/legacy_dao')
const InventoryRepository = require('./models/inventory_repository')
const PartRepository = require('./models/part_repository')
const OrderRepository = require('./models/order_repository')
const ShippingRepository = require('./models/shipping_repository')

function main() {
    const legacyDao = new LegacyDAO()
    const dao = new AppDAO('./db/database.db')
    const inventoryRepo = new InventoryRepository(dao)
    const partRepo = new PartRepository(legacyDao)
    const orderRepo = new OrderRepository(dao)
    const shippingRepo = new ShippingRepository(dao)

    shippingRepo.createTable();

    inventoryRepo.createTable()
        .then(() => partRepo.getAll())
        .then((rows) => {
            return new Promise((resolve, reject) => {
                rows.forEach((row) => {
                    inventoryRepo.create(row.number, Math.floor(Math.random() * 21))
                })
                resolve('success')
            })
        })
        .then(() => inventoryRepo.getAll())
        .then((rows) => {
            return new Promise((resolve, reject) => {
                rows.forEach((row) => {
                    console.log(`partNumber = ${row.partNumber} quantity = ${row.quantity}`)
                })
                resolve('success')
            })
        })
        .then(() => orderRepo.createTable())
        .then(() => orderRepo.create("Jane", "Doe", "gallegos.marceline@gmail.com", 999.99, 50, "123 Main Street", "Dekalb", "IL", "60115", "United States"))
        .then(() => orderRepo.create("John", "Doe", "gallegos.marceline@gmail.com", 39.99, 20, "123 Main Street", "Dekalb", "IL", "60115", "United States"))
        .catch((err) => {
            console.error(err.message)
        })
}

main()