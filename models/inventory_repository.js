class InventoryRepository {
    constructor(dao) {
        this.dao = dao
    }

    createTable() {
        const sql = `
        CREATE TABLE IF NOT EXISTS inventory (
            partNumber INTEGER PRIMARY KEY,
            quantity INTEGER NOT NULL
        )`
        return this.dao.run(sql)
    }

    create(partNumber, quantity) {
        return this.dao.run(
            `INSERT INTO inventory (partNumber, quantity)
                VALUES (?, ?)`,
            [partNumber, quantity]
        )
    }

    update(partNumber, quantity) {
        return this.dao.run(
            `UPDATE inventory SET quantity = ? WHERE partNumber = ?`,
            [quantity, partNumber]
        )
    }

    delete(partNumber) {
        return this.dao.run(
            `DELETE FROM inventory WHERE partNumber = ?`,
            [partNumber]
        )
    }

    getById(partNumber) {
        return this.dao.get(
            `SELECT * FROM inventory WHERE partNumber = ?`,
            [partNumber]
        )
    }

    getAll() {
        return this.dao.all(`SELECT * FROM inventory`)
    }
}

module.exports = InventoryRepository