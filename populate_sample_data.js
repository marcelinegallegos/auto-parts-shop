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
        .catch((err) => {
            console.error(err.message)
        })

        orderRepo.createTable()
        .then(() => orderRepo.getAll())
        .then((rows) => {
            return new Promise((resolve, reject) => {
                rows.forEach((row) => {
                    orderRepo.create("Megan", "Moisant", "megmoisant@gmail.com", 39.99, 20, "400 E Hillcrest Dr", "Dekalb", "IL", "60031", "United States")
                })
                resolve('success')
            })
        })
        .then(() => orderRepo.getAll())
        .then((rows) => {
            return new Promise((resolve, reject) => {
                rows.forEach((row) => {
                    console.log(`date = ${row.date} order_id = ${row.id}`)
                })
                resolve('success')
            })
        })
        .catch((err) => {
            console.error(err.message)
        })
}

main()