class OrderItemsRepository {
    constructor(dao) {
        this.dao = dao
    }
    
    createTable() {
        const sql = `
        CREATE TABLE IF NOT EXISTS orderItems (
            orderId INTEGER NOT NULL,
            orderPartNumber INTEGER NOT NULL,
            quantity INTEGER NOT NULL,
            PRIMARY KEY (orderId, orderPartNumber),
            FOREIGN KEY (orderId) REFERENCES orders(id)
                ON DELETE CASCADE
        )`
        return this.dao.run(sql)
    }

    create(orderId, orderPartNumber, quantity) {
        return this.dao.run(
            `INSERT INTO orderItems (orderId, orderPartNumber, quantity)
                VALUES (?, ?, ?)`,
            [orderId, orderPartNumber, quantity]
        )
    }

    delete(orderId) {
        return this.dao.run(
            `DELETE FROM orderItems WHERE orderId = ?`,
            [orderId]
        )
    }

    getById(orderId) {
        return this.dao.query(
            `SELECT * FROM orderItems WHERE orderId = ?`,
            [orderId]
        )
    }

    getAll() {
        return this.dao.query(`SELECT * FROM orderItems`)
    }

}

module.exports = OrderItemsRepository