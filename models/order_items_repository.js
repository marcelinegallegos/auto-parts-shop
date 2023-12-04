class OrderItemsRepository {
    constructor(dao) {
        this.dao = dao
    }
    
    createTable() {
        const sql = `
        CREATE TABLE IF NOT EXISTS orderItems (
            orderId INTEGER NOT NULL,
            partNumber INTEGER NOT NULL,
            quantity INTEGER NOT NULL,
            PRIMARY KEY (orderId, partNumber),
            FOREIGN KEY (orderId) REFERENCES orders(id)
                ON DELETE CASCADE
        )`
        return this.dao.run(sql)
    }

    create(orderId, partNumber, quantity) {
        return this.dao.run(
            `INSERT INTO orderItems (orderId, partNumber, quantity)
                VALUES (?, ?, ?)`,
            [orderId, partNumber, quantity]
        )
    }

    delete(orderId) {
        return this.dao.run(
            `DELETE FROM orderItems WHERE orderId = ?`,
            [orderId]
        )
    }

    getById(orderId) {
        return this.dao.all(
            `SELECT * FROM orderItems WHERE orderId = ?`,
            [orderId]
        )
    }

    getAll() {
        return this.dao.all(`SELECT * FROM orderItems`)
    }

}

module.exports = OrderItemsRepository
