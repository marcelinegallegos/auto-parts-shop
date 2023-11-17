const Promise = require('bluebird')
const AppDAO = require('./models/app_dao')
const LegacyDAO = require('./models/legacy_dao')
const InventoryRepository = require('./models/inventory_repository')
const ProductRepository = require('./models/product_repository')
const OrderRepository = require('./models/order_repository')

function main() {
    const legacyDao = new LegacyDAO()
    const dao = new AppDAO('./db/database.db')
    const inventoryRepo = new InventoryRepository(dao)
    const productRepo = new ProductRepository(legacyDao)
    const orderRepo = new OrderRepository(dao)

    inventoryRepo.createTable()
        .then(() => productRepo.getAll())
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
                    console.log(`product_id = ${row.partNumber} quantity = ${row.quantity}`)
                })
                resolve('success')
            })
        })
        .then(() => orderRepo.createTable())
        .then(() => orderRepo.create("Jane", "Doe", "janedoe@gmail.com", 999.99, 50, "123 Main Street", "Dekalb", "IL", "60115", "United States"))
        .then(() => orderRepo.create("John", "Doe", "johndoe@gmail.com", 39.99, 20, "123 Main Street", "Dekalb", "IL", "60115", "United States"))
        .catch((err) => {
            console.error(err.message)
        })
}

main()