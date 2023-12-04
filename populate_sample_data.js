const Promise = require('bluebird')
const AppDAO = require('./models/app_dao')
const LegacyDAO = require('./models/legacy_dao')
const InventoryRepository = require('./models/inventory_repository')
const PartRepository = require('./models/part_repository')
const OrderRepository = require('./models/order_repository')
const ShippingRepository = require('./models/shipping_repository')
const OrderItemsRepository = require('./models/order_items_repository')

function main() {
    const legacyDao = new LegacyDAO()
    const dao = new AppDAO('./db/database.db')
    const inventoryRepo = new InventoryRepository(dao)
    const partRepo = new PartRepository(legacyDao)
    const orderRepo = new OrderRepository(dao)
    const shippingRepo = new ShippingRepository(dao)
    const orderItemsRepo = new OrderItemsRepository(dao)

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
        .then(() => orderRepo.create("Jane", "Doe", "janedoe@gmail.com", 999.99, 50, "123 Main Street", "Dekalb", "IL", "60115", "United States"))
        .then(() => orderRepo.create("John", "Doe", "johndoe@gmail.com", 39.99, 20, "123 Main Street", "Dekalb", "IL", "60115", "United States"))
        .then(() => orderItemsRepo.createTable())
        .then(() => orderItemsRepo.create("1", "1", "2"))
        .then(() => orderItemsRepo.create("1", "2", "1"))
        .then(() => orderItemsRepo.create("2", "4", "5"))
        .then(() => orderItemsRepo.create("2", "6", "1"))
        .then(() => orderItemsRepo.create("2", "5", "1"))
        .catch((err) => {
            console.error(err.message)
        })
}

main()