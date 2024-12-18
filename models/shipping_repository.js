class ShippingRepository {
    constructor(dao) {
        this.dao = dao
    }

    createTable() {
        const sql = `
        CREATE TABLE IF NOT EXISTS shipping (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            minWeight REAL NOT NULL,
            maxWeight REAL NOT NULL,
            cost REAL NOT NULL
        )`
        return this.dao.run(sql)
    }

    create(minWeight, maxWeight, cost) {
        return this.dao.run(
            `INSERT INTO shipping (minWeight, maxWeight, cost)
                VALUES (?, ?, ?)`,
        [minWeight, maxWeight, cost]
        )
    }

    update(id, minWeight, maxWeight, cost) {
        return this.dao.run(`
            UPDATE shipping 
            SET minWeight = ?,
                maxWeight = ?,
                cost = ?
            WHERE id = ?`,
            [minWeight, maxWeight, cost, id]
        )
    }

    delete(id) {
        return this.dao.run(
            `DELETE FROM shipping WHERE id = ?`,
            [id]
        )
    }

    getById(id) {
        return this.dao.get(
            `SELECT * FROM shipping WHERE id = ?`,
            [id]
        )
    }

    getByWeight(weight) {
        return this.dao.get(
            `SELECT * FROM shipping WHERE ? BETWEEN minWeight AND maxWeight`,
            [weight]
        )
    }

    getAll() {
        return this.dao.all(`SELECT * FROM shipping`)
    }

    sort() {
        return this.dao.all(`SELECT * FROM shipping ORDER BY minWeight`)
    }

    getMinWeightBracket() {
        return this.dao.get(`SELECT * FROM shipping WHERE minWeight = ( SELECT MIN(minWeight) FROM shipping );`)
    }

    getMaxWeightBracket() {
        return this.dao.get(`SELECT * FROM shipping WHERE maxWeight = ( SELECT MAX(maxWeight) FROM shipping );`)
    }

}


module.exports = ShippingRepository