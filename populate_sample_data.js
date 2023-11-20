const Promise = require('bluebird')
const AppDAO = require('./models/app_dao')
const LegacyDAO = require('./models/legacy_dao')
const InventoryRepository = require('./models/inventory_repository')
const PartRepository = require('./models/part_repository')

function main() {
    const legacyDao = new LegacyDAO()
    const dao = new AppDAO('./db/database.db')
    const inventoryRepo = new InventoryRepository(dao)
    const partRepo = new PartRepository(legacyDao)

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
        .catch((err) => {
            console.error(err.message)
        })
}

main()